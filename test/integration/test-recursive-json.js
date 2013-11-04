var assert = require('assert');
var SandboxedModule = require('../..');

var fakeBar = "fakeBar";
var requireModule = SandboxedModule.load('../fixture/includeJson');
var recursiveExports = requireModule.exports;
assert.strictEqual(recursiveExports.json.value, "value from json");
