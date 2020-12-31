import { last, merge } from "lodash";
import { ClassDeclaration, Decorator, Project, Type, Symbol as tsSymbol, ts, SymbolFlags } from "ts-morph";
import { getMinMaxValidation } from "./ajv.service";
import { toSnack } from "../utils/util";
const project = new Project({ tsConfigFilePath: process.cwd() + "/tsconfig.json" });
const sourceFiles = project.getSourceFiles();
const allClasses: { [name: string]: ClassDeclaration } = {};
sourceFiles.forEach(s => {
  s.getClasses().forEach(c => {
    allClasses[c.getName() as string] = c;
  });
});

export const isPrimitive = (type: Type) => type.isBoolean() || type.isNumber() || type.isString();

export const getClass = name => allClasses[name];
function handleExplicitValidation(type: string, schema: any, decorators: Decorator[] = []) {
  decorators.forEach(d => {
    const dName = d.getName();
    switch (dName) {
      case "min":
      case "max": {
        schema = merge(schema, getMinMaxValidation(dName, type, +d.getArguments()[0].getText()));
        break;
      }
      case "time":
      case "date":
      case "dateTime":
      case "duration":
      case "uri":
      case "uriReference":
      case "uriTemplate":
      case "email":
      case "hostname":
      case "ipv4":
      case "ipv6":
      case "uuid":
      case "jsonPointer":
      case "relativeJsonPointer": {
        schema = merge(schema, { format: toSnack(dName) });
        break;
      }
    }
  });
  return schema;
}

export const getParamSchema = (type: Type, decorators: Decorator[] = [], prop: tsSymbol | undefined = undefined) => {
  const typeText = type.getText();
  const nonNullableType = type.getNonNullableType();
  let schema: {
    optional?: boolean;
    type?: string;
    items?: any;
    properties?: any;
    required?: string[];
    allOf?: any[];
    enum?: string[];
  } = {};
  schema.optional = typeText.includes("| undefined");

  if (nonNullableType.isArray()) {
    schema = handleExplicitValidation("array", schema, decorators);
    schema.type = "array";
    schema.items = getParamSchema(nonNullableType.getArrayElementTypeOrThrow(), []);
    Object.keys(schema.items).forEach(key => delete schema.items[key].optional);
    delete schema.items.optional;
    return schema;
  }

  if (isPrimitive(nonNullableType)) {
    schema.type = typeText.replace(" | undefined", "");
    if (schema.type === "string") {
      schema["notEmptyString"] = true;
    }
    schema = handleExplicitValidation(nonNullableType.getText(), schema, decorators);
    return schema;
  }

  if (nonNullableType.isObject()) {
    schema = handleExplicitValidation("object", schema, decorators);
    schema.type = "object";
    schema.properties = {};
    schema.required = schema.required || [];

    type.getProperties().forEach(prop => {
      // if (prop.isGetter) return;
      const key = prop.getName();
      const isGetter = prop.hasFlags(SymbolFlags.GetAccessor);

      if (["request", "reply"].includes(key) || isGetter) {
        return;
      }
      const valueDeclaration = prop.getValueDeclarationOrThrow();
      ///const isGetter = valueDeclaration.getSymbolOrThrow().getFlags() === ts.SymbolFlags.Accessor;
      const decorators = (valueDeclaration as any).getDecorators ? (valueDeclaration as any).getDecorators() : [];
      schema.properties[key] = getParamSchema(valueDeclaration.getType(), decorators, prop);
      if (schema.properties[key].optional !== true) {
        schema.required?.push(key);
      }
      delete schema.properties[key].optional;
    });
    if (!schema.required.length) {
      delete schema.required;
    }

    return schema;
  }

  if (nonNullableType.isEnumLiteral() && prop) {
    schema.type = "string";
    schema.enum = (prop as any)
      .getValueDeclarationOrThrow()
      .getSourceFile()
      .getEnum(e => e.getName() === nonNullableType.getText())
      .getMembers()
      .map(m => m.getName());
    return schema;
  }

  if (nonNullableType.isEnum()) {
    schema.type = "string";
    schema.enum = nonNullableType.getUnionTypes().map(t => last(t.getText().split(".")) as string);
    return schema;
  }
};

export const getMethodSchema = (c, m) => {
  const method = allClasses[c.name]?.getMethodOrThrow(m);
  const description = method?.getJsDocs()[0]?.getDescription();
  let responseType = method?.getReturnType();
  if (responseType?.getTypeArguments()[0]) responseType = responseType?.getTypeArguments()[0];
  const responseSchema = responseType ? getParamSchema(responseType) : {};
  delete responseSchema?.optional;
  return { description, response: responseSchema ? { 201: responseSchema } : undefined };
};
