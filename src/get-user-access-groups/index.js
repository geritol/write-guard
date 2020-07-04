const query = require("./query");
const transform = require("./transform");

module.exports = async ({ user, owner, repo }) => {
  const accessGroups = await query({ user, owner, repo });
  return transform(accessGroups, user);
};
