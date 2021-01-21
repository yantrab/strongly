import { getClass } from "../../utils/typescript-service";
import { Provider, ValueProvider } from "../../utils/util";

export class DIService {
  private dependencies = {};

  private async getDependency(target) {
    if (!this.dependencies[target.name]) {
      await this.getDependencies(target);
    }
    return this.dependencies[target.name];
  }

  async getDependencies(target) {
    const classDeclaration = getClass(target.name);
    const classDependencies: any[] = [];
    if (!classDeclaration) {
      return [];
    }
    for (const c of classDeclaration.getConstructors()) {
      for (const p of c.getParameters()) {
        const type = p.getType();
        const cName = type.getText().split(".")[type.getText().split(".").length - 1];

        if (this.dependencies[cName]) {
          classDependencies.push(this.dependencies[cName]);
          continue;
        }

        const firstProp = type.getProperties()[0];
        if (firstProp) {
          const d: any = await import(
            firstProp
              .getValueDeclarationOrThrow()
              .getSourceFile()
              .getFilePath()
          );
          classDependencies.push(await this.getDependency(d[cName]));
        }
      }
    }
    this.dependencies[target.name] = new target(...classDependencies);
    return classDependencies;
  }

  async setDependencies(providers?: Provider[]) {
    let name;
    let provider;
    if (!providers) return;
    for (let p of providers) {
      if ("useValue" in p) {
        p = p as ValueProvider;
        name = p.provide.name || p.provide;
        provider = p.useValue;
      } else {
        p = p as { new (...args) };
        name = p.name;
        provider = new p(...(await this.getDependencies(p)));
      }

      this.dependencies[name] = provider;
    }
  }

  async inject(target, providers?: Provider[]) {
    await this.setDependencies(providers);

    if (!this.dependencies[target.name]) {
      await this.getDependencies(target);
    }
    return this.dependencies[target.name];
  }

  override(name, instance) {
    this.dependencies[name] = instance;
  }
  async mock(target, key, o) {
    this.dependencies[target.name][key] = typeof o === "function" ? o : () => o;
  }
}
