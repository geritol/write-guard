const gitBranch = require("git-branch");
const GitHub = require("./github");
const { expect, sinon } = require("./test-setup");

describe("writeGuard", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should throw an error when not running on default branch", async () => {
    const settings = {};
    const stub = sinon.stub(gitBranch, "sync");
    stub.returns("non-main");

    const stub2 = sinon.stub(GitHub, "getDefaultBranch");
    stub2.resolves("main");
    const writeGuard = require("./write-guard");

    await expect(writeGuard(settings)).to.be.rejectedWith(
      Error,
      "Expected to run on main branch, running on 'non-main'"
    );
  });
});
