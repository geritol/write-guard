import writeGuard, { AccessInfo } from "./write-guard";
import loadSettings from "./load-settings";

const exitWithError = (message: string) => {
  console.error(message);
  process.exit(1);
};

(async () => {
  const settings = loadSettings(".");
  let accessInfo: AccessInfo[];
  try {
    accessInfo = await writeGuard(settings);
  } catch (error) {
    exitWithError(error.message);
  }
  if (accessInfo!.some((info) => !info.canWrite)) {
    exitWithError(
      `User '${settings.github.user}' has no write access to all files in pull request #${settings.github.prNumber}`
    );
  }
})();
