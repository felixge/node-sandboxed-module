var assert = require('assert');
var SandboxedModule = require('../..');

var exports = SandboxedModule.load('../fixture/parent');
console.log("exports", exports)
assert.ok(exports.module.parent);
