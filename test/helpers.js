const chai = require('chai');
const expect = chai.expect;

function dateEqual(actual, expected) {
  expect(actual.toUTCString()).to.equals(expected.toUTCString());
}

module.exports = {
  dateEqual
}