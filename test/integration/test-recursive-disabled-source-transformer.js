var assert = require('assert');
var SandboxedModule = require('../..');

var requireModule = SandboxedModule.load('../fixture/recursiveSourceTransformer', {
  sourceTransformers: {
    turnBarToReplacedBar: function (source) {
      return source.replace(/'bar'/g, '\'replacedBar\'');
    }
  },
  singleOnly: true
});

var recursiveExports = requireModule.exports;
assert.strictEqual(recursiveExports.bar, 'replacedBar');
assert.strictEqual(recursiveExports.foo.bar, 'bar');
