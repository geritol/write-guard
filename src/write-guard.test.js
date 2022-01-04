const gitBranch = require("git-branch");
const { expect, sinon } = require("./test-setup");

describe("writeGuard", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should throw an error when not running on master branch", async () => {
    const settings = { defaultBranch: "master" };
    const stub = sinon.stub(gitBranch, "sync");
    stub.returns("non-master");
    const writeGuard = require("./write-guard");

    await expect(writeGuard(settings)).to.be.rejectedWith(
      Error,
      "Expected to run on master branch, running on 'non-master'"
    );
  });
});
