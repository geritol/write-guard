const writeGuard = require("./write-guard");
const loadSettings = require("./load-settings");

const exitWithError = (message) => {
  console.error(message);
  process.exit(1);
};

(async () => {
  const settings = loadSettings(".");
  try {
    var accessInfo = await writeGuard(settings);
  } catch (error) {
    exitWithError(error.message);
  }
  if (accessInfo.some((info) => !info.canWrite)) {
    exitWithError(
      `User '${settings.github.user}' has no write access to all files in pull request #${settings.github.prNumber}`
    );
  }
})();
