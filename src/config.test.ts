import Config from "./config";
import * as yaml from "js-yaml";
import * as mockFs from "mock-fs";
import { expect } from "./test-setup";

describe("Config", () => {
  describe("createFromFile", () => {
    beforeEach(() => {
      mockFs({
        "some-file": yaml.dump({ "test-content": "hello" }),
      });
    });
    afterEach(() => {
      mockFs.restore();
    });

    it("should return an instance of config", () => {
      const config = Config.createFromFile("some-file");
      expect(config).to.be.an.instanceOf(Config);
    });

    it("should load file's content", () => {
      const config = Config.createFromFile("some-file");
      expect(config.content).to.deep.equal({ "test-content": "hello" });
    });
  });

  describe("getAllowedPaths", () => {
    it("should return allowed paths for user", () => {
      const config = new Config({
        access: {
          "**": ["user/a"],
          "src/**": ["user/b"],
          "dist/**": ["user/b"],
        },
      });
      const allowedGroups = config.getAllowedPaths("user/b");
      expect(allowedGroups).to.deep.equal(["src/**", "dist/**"]);
    });

    it("should resolve allowed paths for roles", () => {
      const config = new Config({
        roles: { edit: ["user/a"] },
        access: {
          "**": ["role/edit"],
          "src/**": ["user/b"],
          "dist/**": ["user/b"],
        },
      });
      const allowedGroups = config.getAllowedPaths("user/a");
      expect(allowedGroups).to.deep.equal(["**"]);
    });
  });
});
