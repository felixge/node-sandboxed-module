var assert = require('assert');
var SandboxedModule = require('../..');

var path = '../fixture/global';
var globalModule = SandboxedModule.load(path);
var globals = globalModule.exports;

assert.ok(globals.global);
assert.strictEqual(globals.GLOBAL, globals.global);
assert.strictEqual(globals.root, globals.global);

for (var key in global) {
  if (/global|root/i.test(key)) {
    continue;
  }

  assert.strictEqual(globals[key], global[key], key);
}
