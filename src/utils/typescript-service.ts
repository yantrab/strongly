import { last, merge } from "lodash";
import { ClassDeclaration, Decorator, Project, Type, Symbol as tsSymbol, SymbolFlags } from "ts-morph";
import { getMinMaxValidation } from "./ajv.service";
import { Schema, toSnack } from "../utils/util";
const project = new Project({ tsConfigFilePath: process.cwd() + "/tsconfig.json" });
const sourceFiles = project.getSourceFiles();
const allClasses: { [name: string]: ClassDeclaration } = {};
sourceFiles.forEach(s => {
  s.getClasses().forEach(c => {
    allClasses[c.getName() as string] = c;
  });
});
const definitions = {};
export const getDefinitions = () => definitions;
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

const getObjectSchema = (type: Type, decorators) => {
  let schema: Schema = {};
  schema = handleExplicitValidation("object", schema, decorators);
  schema.type = "object";
  schema.properties = {};
  schema.required = schema.required || [];
  type.getProperties().forEach(prop => {
    const key = prop.getName();
    const isGetter = prop.hasFlags(SymbolFlags.GetAccessor);
    if (["request", "reply"].includes(key) || isGetter) return;
    const valueDeclaration = prop.getValueDeclarationOrThrow();
    const decorators = (valueDeclaration as any).getDecorators ? (valueDeclaration as any).getDecorators() : [];
    schema.properties[key] = getParamSchema(valueDeclaration.getType(), decorators, prop) || { type: "object" };
    if (schema.properties[key].optional !== true) {
      schema.required?.push(key);
    }
    delete schema.properties[key].optional;
  });

  if (!schema.required.length) {
    delete schema.required;
  }
  return schema;
};
export const getParamSchema = (type: Type, decorators: Decorator[] = [], prop: tsSymbol | undefined = undefined) => {
  const typeText = type.getText();
  const nonNullableType = type.getNonNullableType();
  let schema: Schema = {};
  schema.optional = typeText.includes("| undefined");

  if (nonNullableType.isArray()) {
    schema = handleExplicitValidation("array", schema, decorators);
    schema.type = "array";
    schema.items = getParamSchema(nonNullableType.getArrayElementTypeOrThrow(), []) || {};
    Object.keys(schema.items).forEach(key => delete schema.items[key].optional);
    delete schema.items.optional;
    return schema;
  }
  if (typeText === "Date") {
    schema.type = "string";
    schema["format"] = "date-time";
    return schema;
  }

  if (isPrimitive(nonNullableType)) {
    schema.type = typeText.replace(" | undefined", "");
    if (schema.type === "string") {
      schema["allOf"] = [{ transform: ["trim"] }, { minLength: 1 }];
    }
    schema = handleExplicitValidation(nonNullableType.getText(), schema, decorators);
    return schema;
  }

  if (type.isClass()) {
    const name = type.getText().split(").")[1] || type.getText();
    schema["$ref"] = "#/definitions/" + name;
    if (!definitions[name]) definitions[name] = getObjectSchema(nonNullableType, decorators);
    return schema;
  }

  if (nonNullableType.isObject()) {
    schema = getObjectSchema(nonNullableType, decorators);
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

  const unionTypes = type.getUnionTypes().filter(t => !t.isUndefined());
  if (unionTypes.length > 1) {
    schema.oneOf = unionTypes.map(t => getParamSchema(t, decorators)) as Schema[];
    if (!schema.oneOf[0]) {
      delete schema.oneOf;
      schema.type = "string";
      schema.enum = unionTypes.map(t => t.getText().slice(1, -1));
    }
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
  return { description, responses: responseSchema ? { 201: { schema: responseSchema } } : undefined };
};
