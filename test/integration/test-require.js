var assert = require('assert');
var SandboxedModule = require('../..');

var foo = SandboxedModule.require('../fixture/foo');
assert.strictEqual(foo.foo, 'foo');
assert.strictEqual(foo.bar, 'bar');
