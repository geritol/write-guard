const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");
const { execSync } = require("child_process");
const writeGuard = require("./write-guard");
const { expect } = require("./test-setup");
const loadSettings = require("./load-settings");
const gitBranch = require("git-branch");

const githubEventPath = process.env.GITHUB_EVENT_PATH;
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
        repository: {
          default_branch: gitBranch.sync(),
        },
      })
    );
  });
  after(() => {
    rimraf.sync(testRepoPath);
    process.env.GITHUB_EVENT_PATH = githubEventPath;
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

describe("event.json", () => {
  it("contains all required information", () => {
    const event = JSON.parse(fs.readFileSync(githubEventPath, "utf8"));

    expect(event.pull_request.number).to.be.a("number");
    expect(event.repository.default_branch).to.be.a("string");
    expect(event.sender.login).to.be.a("string");
    expect(event.sender.type).be.a("string");
  });
});
