import * as gitBranch from "git-branch";
import { expect, sinon } from "./test-setup";

describe("writeGuard", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should throw an error when not running on default branch", async () => {
    const settings = { defaultBranch: "master" };
    const stub = sinon.stub(gitBranch, "sync");
    stub.returns("non-master");
    //eslint-disable-next-line @typescript-eslint/no-var-requires
    const writeGuard = require("./write-guard");

    await expect(writeGuard.default(settings)).to.be.rejectedWith(
      Error,
      "Expected to run on master branch, running on 'non-master'"
    );
  });
});
