import Config from "./config";
import User from "./user";
import { getFilesChanged, getUserAccessGroups } from "./github";
import * as gitBranch from "git-branch";
import { Settings } from "./load-settings";

export type AccessInfo = { canWrite: boolean; file: string };

export default async (settings: Settings): Promise<AccessInfo[]> => {
  const branch = gitBranch.sync();
  if (branch !== settings.defaultBranch) {
    throw new Error(
      `Expected to run on ${settings.defaultBranch} branch, running on '${branch}'`
    );
  }

  console.info(`Loading config from '${settings.configPath}'`);
  const config = Config.createFromFile(settings.configPath);

  console.info(`Checking write access for user '${settings.github.user}'`);
  const [filesChanged, userAccessGroups] = await Promise.all([
    getFilesChanged(settings.github),
    getUserAccessGroups(settings.github),
  ]);
  const user = User.init(config, userAccessGroups);

  const hasAccess = filesChanged.map((file) => ({
    file,
    canWrite: user.hasAccess(file),
  }));

  hasAccess.forEach((file) => {
    if (file.canWrite) {
      console.info(`Write of '${file.file}' is permitted`);
    } else {
      console.error(`Write of '${file.file}' is not permitted`);
    }
  });

  return hasAccess;
};
