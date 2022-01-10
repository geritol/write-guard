//eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import * as fs from "fs";
import * as path from "path";

export type Settings = {
  configPath: string;
  defaultBranch: string;
  github: {
    authorization: string;
    branch: string | undefined;
    prNumber: number;
    user: string;
    owner: string;
    repo: string;
  };
};

export default (runPath: string): Settings => {
  const GITHUB_REPOSITORY = loadEnvVar("GITHUB_REPOSITORY");
  const GITHUB_EVENT_PATH = loadEnvVar("GITHUB_EVENT_PATH");
  const GITHUB_TOKEN = loadEnvVar("GITHUB_TOKEN");

  const [owner, repo] = GITHUB_REPOSITORY.split(/\/(.+)/);
  const event = JSON.parse(fs.readFileSync(GITHUB_EVENT_PATH, "utf8"));

  return Object.freeze({
    configPath: path.join(runPath, "write-guard.yaml"),
    defaultBranch: event.repository.default_branch,
    github: {
      authorization: `Bearer ${GITHUB_TOKEN}`,
      branch: process.env.GITHUB_REF,
      prNumber: event.pull_request.number,
      user: event.sender.login,
      owner,
      repo,
    },
  });
};

const loadEnvVar = (envVarName: string): string => {
  if (!process.env[envVarName]) {
    throw new Error(
      `Expected environment variable ${envVarName} to be defined`
    );
  }
  return process.env[envVarName] as string;
};
