const Config = require("./config");
const yaml = require("js-yaml");
const mockFs = require("mock-fs");
const { expect } = require("./test-setup");

describe("Config", () => {
  describe("createFromFile", () => {
    beforeEach(() => {
      mockFs({
        "some-file": yaml.safeDump({ "test-content": "hello" }),
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

  describe("getAllowedGroups", () => {
    it("should returns matching path groups", () => {
      const config = new Config({
        access: {
          "**": ["users/a"],
          "foo/**": ["users/b"],
          "/aa/foo/bb": ["users/c"],
        },
      });
      const allowedGroups = config.getAllowedGroups("foo/bar");
      expect(allowedGroups).to.have.lengthOf(2);
    });

    it("should flatten matching path groups", () => {
      const config = new Config({
        access: {
          "**": ["users/a", "users/c"],
        },
      });
      const allowedGroups = config.getAllowedGroups("foo/bar");
      expect(allowedGroups).to.have.lengthOf(2);
    });

    ["user", "permission", "team"].forEach((type) =>
      it(`should parse matching path group type and value - ${type}`, () => {
        const config = new Config({
          access: {
            "**": [`${type}/a`],
          },
        });
        const allowedGroups = config.getAllowedGroups("foo/bar");
        expect(allowedGroups).to.deep.equal([{ type, value: "a" }]);
      })
    );

    it("should resolve type role from roles", () => {
      const config = new Config({
        access: {
          "**": [`role/a`],
        },
        roles: {
          a: ["user/b", "team/c", "permission/d"],
        },
      });
      const allowedGroups = config.getAllowedGroups("foo/bar");
      expect(allowedGroups).to.deep.equal([
        { type: "user", value: "b" },
        { type: "team", value: "c" },
        { type: "permission", value: "d" },
      ]);
    });
  });
});
