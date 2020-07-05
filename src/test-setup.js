const chai = require("chai");
const sinon = require("sinon");

chai.use(require("chai-as-promised"));

module.exports = { expect: chai.expect, sinon };
