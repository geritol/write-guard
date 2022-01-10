import { Octokit } from "@octokit/rest";

// Using the REST API as currently GraphQL API does not
// support getting the files changed for a commit
export default async ({
  owner,
  repo,
  authorization,
  prNumber,
}: {
  owner: string;
  repo: string;
  authorization: string;
  prNumber: number;
}): Promise<string[]> => {
  const octokit = new Octokit({ auth: authorization });
  const { data: files } = (await octokit.request(
    `/repos/${owner}/${repo}/pulls/${prNumber}/files`
  )) as { data: { filename: string }[] };
  return files.map((file) => file.filename);
};
