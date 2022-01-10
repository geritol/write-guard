export default (result: any, user: string) => {
  const teams = result.user.organization
    ? Object.values(result.user.organization.teams.edges[0].node).map(
        (slug) => `team/${slug}`
      )
    : [];

  return [
    `user/${user}`,
    `permission/${result.repository.collaborators.edges[0].permission.toLowerCase()}`,
    ...teams,
  ];
};
