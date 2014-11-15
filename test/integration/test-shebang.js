var assert = require('assert');
var SandboxedModule = require('../..');

var shebang = SandboxedModule.load('../fixture/shebang').exports;
assert.strictEqual(shebang, 'ok');
