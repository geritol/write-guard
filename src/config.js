const fs = require("fs");
const yaml = require("js-yaml");

class Config {
  constructor(config) {
    this.content = config;
  }

  getAllowedPaths(group) {
    return Object.keys(this.content.access).filter((path) => {
      const groups = this.content.access[path];
      return groups.some((g) => {
        const [type, value] = g.split(/\/(.+)/);
        if (type === "role") {
          return this.content.roles[value].some((g) => g === group);
        }
        return g === group;
      });
    });
  }
}

Config.createFromFile = (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  const parsedContent = yaml.load(content);
  return new Config(parsedContent);
};

module.exports = Config;
