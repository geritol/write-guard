const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");
const { execSync } = require("child_process");
const writeGuard = require("./write-guard");
const { expect } = require("./test-setup");
const loadSettings = require("./load-settings");

const testRepoPath = path.join(process.cwd(), "write-guard-test");
describe("writeGuard", () => {
  before(() => {
    fs.mkdirSync(testRepoPath);
    execSync("git clone https://github.com/geritol/write-guard-test.git .", {
      stdio: [0, 1, 2],
      cwd: path.resolve(testRepoPath),
    });
    process.env.GITHUB_REPOSITORY = "geritol/write-guard-test";
    process.env.GITHUB_EVENT_PATH = path.join(testRepoPath, "event.json");
    fs.writeFileSync(
      process.env.GITHUB_EVENT_PATH,
      JSON.stringify({
        pull_request: { number: 2 },
        sender: {
          login: "geritol",
          type: "User",
        },
      })
    );
  });
  after(() => {
    rimraf.sync(testRepoPath);
  });
  it("should return access info for each file", async () => {
    const settings = loadSettings(testRepoPath);
    const hasAccess = await writeGuard(settings);
    expect(hasAccess).to.deep.equal([
      { file: "allowed/README.md", canWrite: true },
      { file: "not-allowed/README.md", canWrite: false },
    ]);
  });
});
