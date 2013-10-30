var assert = require('assert');
var SandboxedModule = require('../..');

var requireModule = SandboxedModule.load('../fixture/resolve', {
  recursive:true
});
var recursiveExports = requireModule.exports;
assert.strictEqual(recursiveExports.bar, "bar");
