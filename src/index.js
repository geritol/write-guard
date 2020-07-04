const writeGuard = require("./write-guard");
const loadSettings = require("./load-settings");

const error = (message) => {};

(async () => {
  const settings = loadSettings(".");
  try {
    var accessInfo = await writeGuard(settings);
  } catch (error) {
    error(error.message);
  }
  if (accessInfo.some((info) => !info.canWrite)) {
    error(
      `User '${settings.github.user}' has no write access to all files in pull request #${settings.github.prNumber}`
    );
  }
})();
