var assert = require('assert');
var SandboxedModule = require('../..');

var exports = SandboxedModule.load('../fixture/exports').exports;
assert.strictEqual(exports, 'overwritten');
