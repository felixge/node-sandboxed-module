var assert = require('assert');
var SandboxedModule = require('../..');

var foo = SandboxedModule.load('../fixture/foo').exports;
assert.strictEqual(foo.foo, 'foo');
assert.strictEqual(foo.bar, 'bar');
