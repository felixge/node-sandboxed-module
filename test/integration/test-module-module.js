var assert = require('assert');
var SandboxedModule = require('../..');

var requireModule = SandboxedModule.load('../fixture/moduleModule', {
  requires: { './bar': "fakeBar" }
});
var exports = requireModule.exports;

assert.strictEqual(exports.bar, "fakeBar");

