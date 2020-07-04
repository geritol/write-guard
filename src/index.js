const writeGuard = require("./write-guard");
const loadSettings = require("./load-settings");

(async () => {
  const settings = loadSettings(".");
  const accessInfo = await writeGuard(settings);
  if (accessInfo.some((info) => !info.canWrite)) {
    console.error(
      `User '${settings.github.user}' has no write access to all files in pull request #${settings.github.prNumber}`
    );
    process.exit(1);
  }
})();
