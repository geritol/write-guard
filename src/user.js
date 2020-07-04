const micromatch = require("micromatch");
const uniq = require("lodash.uniq");

class User {
  constructor(accessPaths) {
    this.accessPaths = accessPaths;
  }

  hasAccess(filePath) {
    return this.accessPaths.some((accessPath) =>
      micromatch.isMatch(filePath, accessPath)
    );
  }
}

User.init = (config, accessGroups) => {
  const accessPaths = accessGroups
    .map((group) => config.getAllowedPaths(group))
    .flat();
  return new User(uniq(accessPaths));
};

module.exports = User;
