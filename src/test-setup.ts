import * as chai from "chai";
import * as s from "sinon";
import * as asPromised from "chai-as-promised";

chai.use(asPromised);

export const expect = chai.expect;
export const sinon = s;
