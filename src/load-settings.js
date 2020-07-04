require("dotenv").config();
const fs = require("fs");
const path = require("path");

module.exports = (runPath) => {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split(/\/(.+)/);
  const event = JSON.parse(
    fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8")
  );

  return Object.freeze({
    configPath: path.join(runPath, "write-guard.yaml"),
    github: {
      authorization: `Bearer  ${process.env.GITHUB_TOKEN}`,
      branch: process.env.GITHUB_REF,
      prNumber: event.pull_request.number,
      user: event.sender.login,
      owner,
      repo,
    },
  });
};
