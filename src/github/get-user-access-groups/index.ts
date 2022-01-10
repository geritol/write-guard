import query from "./query";
import transform from "./transform";

export default async ({
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
  const accessGroups = await query({ user, owner, repo, authorization });
  return transform(accessGroups, user);
};
