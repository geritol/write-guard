import Config from "./config";

import * as micromatch from "micromatch";
//eslint-disable-next-line @typescript-eslint/no-var-requires
const uniq = require("lodash.uniq");

class User {
  accessPaths: string[];

  constructor(accessPaths: string[]) {
    this.accessPaths = accessPaths;
  }

  hasAccess(filePath: string) {
    return this.accessPaths.some((accessPath) =>
      micromatch.isMatch(filePath, accessPath)
    );
  }

  static init(config: Config, accessGroups: string[]) {
    const accessPaths = accessGroups
      .map((group) => config.getAllowedPaths(group))
      .flat();
    return new User(uniq(accessPaths));
  }
}

export default User;
