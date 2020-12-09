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
        const d: any = await import(p.getSourceFile().getFilePath());
        const cName = type.getText().split(".")[type.getText().split(".").length - 1];
        types.push(d[cName]);
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

  async inject(target) {
    if (!this.dependencies[target.name]) {
      await this.getDependencies(target);
    }
    return this.dependencies[target.name];
  }
}
