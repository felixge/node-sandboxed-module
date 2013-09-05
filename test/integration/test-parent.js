var assert = require('assert');
var SandboxedModule = require('../..');

var fixture = SandboxedModule.require('../fixture/parent');
assert.strictEqual(fixture.myParent.filename, module.filename);
assert.strictEqual(fixture.myParent, module);
