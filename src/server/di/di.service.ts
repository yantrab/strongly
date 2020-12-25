import { getClass } from "../../utils/typescript-service";

export class DIService {
  private dependencies = {};

  private async getDependency(target) {
    if (!this.dependencies[target.name]) {
      this.dependencies[target.name] = new target(...(await this.getDependencies(target)));
    }
    return this.dependencies[target.name];
  }

  async getDependencies(target) {
    const classDeclaration = getClass(target.name);
    if (!classDeclaration) {
      return [];
    }
    const types: any = [];
    for (const c of classDeclaration.getConstructors()) {
      for (const p of c.getParameters()) {
        const type = p.getType();
        const firstProp = type.getProperties()[0];
        if (firstProp) {
          const d: any = await import(
            firstProp
              .getValueDeclarationOrThrow()
              .getSourceFile()
              .getFilePath()
          );
          const cName = type.getText().split(".")[type.getText().split(".").length - 1];
          types.push(d[cName]);
        }
      }
    }
    const results = await Promise.all(types.map(type => this.getDependency(type)));
    this.dependencies[target.name] = new target(...results);
    return results;
  }

  async setDependencies(providers?: { new (...args) }[]) {
    if (!providers) return;
    for (const p of providers) {
      this.dependencies[p.name] = new p(...(await this.getDependencies(p)));
    }
  }

  async inject(target, providers?: { new (...args) }[]) {
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
