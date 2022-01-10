import loadSettings from "./load-settings";
import * as mock from "mock-fs";
import { expect } from "./test-setup";

const originalGithubToken = process.env.GITHUB_TOKEN;

describe("load-settings", () => {
  before(() => {
    process.env.GITHUB_TOKEN = "test";
    mock({
      "github/event.json": JSON.stringify({
        pull_request: { number: 1 },
        sender: {
          login: "geritol",
          type: "User",
        },
        repository: {
          default_branch: "main",
        },
      }),
    });
    process.env.GITHUB_EVENT_PATH = "github/event.json";
  });
  after(() => {
    mock.restore();
    process.env.GITHUB_TOKEN = originalGithubToken;
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

  it("should return default branch", () => {
    const { defaultBranch } = loadSettings(".");
    expect(defaultBranch).to.equal("main");
  });
});
