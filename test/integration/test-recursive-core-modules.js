var assert = require('assert');
var SandboxedModule = require('../..');

var fakeBar = 'fakeBar';
var requireModule = SandboxedModule.load('../fixture/coreModule');
var recursiveExports = requireModule.exports;
assert.strictEqual(recursiveExports.path, require('path'));
