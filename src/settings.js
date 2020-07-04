require("dotenv").config();

module.exports = Object.freeze({
  github: {
    authorization: `Bearer  ${process.env.GITHUB_TOKEN}`,
  },
});
