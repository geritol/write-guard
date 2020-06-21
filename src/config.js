const fs = require("fs");
const yaml = require("js-yaml");
const micromatch = require("micromatch");

class Config {
  constructor(config) {
    this.content = config;
  }

  get expressions() {
    return Object.keys(this.content.access);
  }

  parseGroup(parseGroup) {
    const [type, ...value] = parseGroup.split("/");
    if (type === "role") {
      return this.content.roles[value].map(this.parseGroup.bind(this));
    }
    return { type, value: value.join("/") };
  }

  allowedGroups(expression) {
    return this.content.access[expression].flatMap(this.parseGroup.bind(this));
  }

  getAllowedGroups(filePath) {
    return this.expressions
      .filter((expression) => micromatch.isMatch(filePath, expression))
      .flatMap(this.allowedGroups.bind(this));
  }
}

Config.createFromFile = (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  const parsedContent = yaml.safeLoad(content);
  return new Config(parsedContent);
};

module.exports = Config;
