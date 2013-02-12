var assert = require('assert');
var SandboxedModule = require('../..');

var path = '../fixture/foo';
var foo1 = SandboxedModule.load(path);
var foo2 = SandboxedModule.load(path);

assert.notStrictEqual(foo1.exports, foo2.exports);
assert.deepEqual(foo1.exports, foo2.exports);
