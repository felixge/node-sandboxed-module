var assert = require('assert');
var SandboxedModule = require('../..');

var path = '../fixture/local';
var localModule = SandboxedModule.load(path);
var locals = localModule.exports;

for (var key in localModule.local) {
  assert.ok(locals[key], key + ' is local');
  assert.ok(!localModule.global[key], key + ' is not global');
}
