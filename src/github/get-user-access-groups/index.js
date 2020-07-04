const query = require("./query");
const transform = require("./transform");

module.exports = async ({ user, owner, repo, authorization }) => {
  const accessGroups = await query({ user, owner, repo, authorization });
  return transform(accessGroups, user);
};
