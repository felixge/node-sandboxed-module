var assert = require('assert');
var SandboxedModule = require('../..');

var requireModule = SandboxedModule.load('../fixture/globalVars', {
  recursive:true
});
var recursiveExports = requireModule.exports;
assert.strictEqual(recursiveExports.worse, "worse");
assert.equal(global.worse,undefined)
