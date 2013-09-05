var assert = require('assert');
var SandboxedModule = require('../..');

var exports = SandboxedModule.load('../fixture/parent');
assert.ok(exports.module.parent);
assert.equal(exports.module.parent.filename, require.resolve('../..'));
