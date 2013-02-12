var assert = require('assert');
var SandboxedModule = require('../..');

var fakeFoo = {my: 'foo module'};
var requireModule = SandboxedModule.load('../fixture/require', {
  requires: { './foo': fakeFoo }
});
var exports = requireModule.exports;

assert.strictEqual(exports.bar, 'bar');
assert.strictEqual(exports.foo, fakeFoo);

assert.strictEqual(requireModule.required['./foo'], fakeFoo);
assert.strictEqual(requireModule.required['./bar'], 'bar');
