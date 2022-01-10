import User from "./user";
import { expect } from "./test-setup";
import Config from "./config";

describe("User", () => {
  describe("hasAccess", () => {
    it("should return true if user has access", () => {
      const user = new User(["**"]);
      expect(user.hasAccess("src/hello.txt")).to.be.true;
    });
    it("should return false if user has no access", () => {
      const user = new User(["src/**"]);
      expect(user.hasAccess("dist/hello.txt")).to.be.false;
    });
  });

  describe("User.init", () => {
    it("should create user with correct access paths", () => {
      const config = new Config({
        access: {
          "foo/**": ["user/1"],
          "bar/**": ["team/2"],
          "no-edit/**": ["user/2"],
        },
      });
      const accessGroups = ["user/1", "team/2"];
      const user = User.init(config, accessGroups);

      expect(user.accessPaths).to.deep.equal(["foo/**", "bar/**"]);
    });

    it("should filter duplicate paths", () => {
      const config = new Config({
        access: {
          "foo/**": ["user/1", "team/2"],
        },
      });
      const accessGroups = ["user/1", "team/2"];
      const user = User.init(config, accessGroups);

      expect(user.accessPaths).to.deep.equal(["foo/**"]);
    });
  });
});
