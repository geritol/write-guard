const { Octokit } = require("@octokit/rest");

// Using the REST API as currently GraphQL API does not
// support getting the files changed for a commit
module.exports = async ({ owner, repo, authorization, prNumber }) => {
  const octokit = new Octokit({ auth: authorization });
  const { data: files } = await octokit.request(
    `/repos/${owner}/${repo}/pulls/${prNumber}/files`
  );
  return files.map((file) => file.filename);
};
