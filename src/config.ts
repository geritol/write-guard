import * as fs from "fs";
import * as yaml from "js-yaml";

export type ActionConfig = {
  roles?: Record<string, string[]>;
  access: Record<string, string[]>;
};

class Config {
  content: ActionConfig;

  constructor(config: ActionConfig) {
    this.content = config;
  }

  getAllowedPaths(group: string) {
    return Object.keys(this.content.access).filter((path) => {
      const groups = this.content.access[path];
      return groups.some((g) => {
        const [type, value] = g.split(/\/(.+)/);
        if (type === "role") {
          const roleConfig = this.content.roles && this.content.roles[value];
          if (!roleConfig) {
            throw new Error(`no config found for role: ${value}`);
          }
          return roleConfig.some((g) => g === group);
        }
        return g === group;
      });
    });
  }

  static createFromFile(filePath: string) {
    const content = fs.readFileSync(filePath, "utf8");
    const parsedContent = yaml.load(content);
    // TODO: validate config
    return new Config(parsedContent as any);
  }
}

export default Config;
