const { Octokit } = require("@octokit/rest");

module.exports = async ({ owner, repo, authorization }) => {
  const octokit = new Octokit({ auth: authorization });
  const resp = await octokit.repos
    .get({
      owner,
      repo,
    })
    .catch((error) => error);

  if (resp instanceof Error) {
    throw new Error(
      `Can't get default branch name for ${owner}/${repo}: ${resp.message}`
    );
  }
  return resp.data.default_branch;
};
