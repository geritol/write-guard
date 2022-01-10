import { graphql } from "@octokit/graphql";

export default ({
  user,
  owner,
  repo,
  authorization,
}: {
  user: string;
  owner: string;
  repo: string;
  authorization: string;
}) => {
  return graphql(
    `
      query getOrgRepoRights($user: String!, $owner: String!, $repo: String!) {
        user(login: $user) {
          organization(login: $owner) {
            teams(userLogins: [$user], first: 100) {
              edges {
                node {
                  slug
                }
              }
            }
          }
        }
        repository(name: $repo, owner: $owner) {
          collaborators(query: $user) {
            edges {
              permission
            }
          }
        }
      }
    `,
    {
      user,
      owner,
      repo,
      headers: {
        authorization,
      },
    }
  );
};
