const loadSettings = require("./load-settings");
const mock = require("mock-fs");
const { expect } = require("./test-setup");

describe("load-settings", () => {
  before(() => {
    mock({
      "github/event.json": JSON.stringify({
        pull_request: { number: 1 },
        sender: {
          login: "geritol",
          type: "User",
        },
      }),
    });
    process.env.GITHUB_EVENT_PATH = "github/event.json";
  });
  after(() => {
    mock.restore();
  });

  it("should return owner", () => {
    process.env.GITHUB_REPOSITORY = "geritol/foo";
    const {
      github: { owner },
    } = loadSettings(".");
    expect(owner).to.equal("geritol");
  });

  it("should return repo", () => {
    process.env.GITHUB_REPOSITORY = "geritol/foo";
    const {
      github: { repo },
    } = loadSettings(".");
    expect(repo).to.equal("foo");
  });
});
