var assert = require('assert');
var SandboxedModule = require('../..');

var requireModule = SandboxedModule.load('../fixture/recursiveSourceTransformer', {
  sourceTransformers: {
    turnBarToReplacedBar: function (source) {
      return source.replace(/exports.bar = 'bar';/g, 'exports.bar = \'replacedBar\'');
    },
    turnFakeBarToReplacedBar: function (source) {
      return source.replace(/module.exports = 'fakeBar';/g, 'module.exports = \'replacedFakeBar\'');
    }
  },
  singleOnly: true
});

var recursiveExports = requireModule.exports;
assert.strictEqual(recursiveExports.bar, 'replacedBar');
assert.strictEqual(recursiveExports.foo.bar, 'bar');
