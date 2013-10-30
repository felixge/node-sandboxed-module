var assert = require('assert');
var SandboxedModule = require('../..');

var fakeBar = "fakeBar";
var requireModule = SandboxedModule.load('../fixture/coreModule', {
  recursive:true
});
var recursiveExports = requireModule.exports;
assert.strictEqual(recursiveExports.path, require("path"));
