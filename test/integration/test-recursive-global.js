var assert = require('assert');
var SandboxedModule = require('../..');

var requireModule = SandboxedModule.load('../fixture/globalVars');
var recursiveExports = requireModule.exports;
assert.strictEqual(recursiveExports.worse, 'worse');
assert.equal(global.worse, undefined);
