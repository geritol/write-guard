const transform = require("./transform");
const { expect } = require("../../test-setup");

describe("get-user-access-groups/transform", () => {
  describe("when user in in the organization", () => {
    it("should return team access groups", () => {
      const queryResult = {
        user: {
          organization: {
            teams: {
              edges: [
                {
                  node: {
                    hello: "hello",
                  },
                },
              ],
            },
          },
        },
        repository: {
          collaborators: { edges: [{ permission: "admin" }] },
        },
      };
      expect(transform(queryResult, "user")).to.contain("team/hello");
    });
  });
});
