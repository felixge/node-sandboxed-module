var assert = require('assert');
var SandboxedModule = require('../..');

var fakeBar = "fakeBar";
var requireModule = SandboxedModule.load('../fixture/require', {
  requires: { './bar': fakeBar },
  singleOnly:true
});
var recursiveExports = requireModule.exports;
assert.strictEqual(recursiveExports.bar, fakeBar);
assert.strictEqual(recursiveExports.foo.bar, "bar");
