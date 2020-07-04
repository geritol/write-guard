const Config = require("./config");
const User = require("./user");
const path = require("path");
const loadSettings = require("./load-settings");
const { getFilesChanged, getUserAccessGroups } = require("./github");

module.exports = async (settings) => {
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
