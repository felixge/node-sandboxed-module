var assert = require('assert');
var SandboxedModule = require('../..');

var fakeBar = 'fakeBar';
var requireModule = SandboxedModule.load('../fixture/recursiveSourceTransformer', {
  requires: {'./bar': fakeBar},
  sourceTransformers: {
    turnBarToReplacedBar: function (source) {
      return source.replace(/'bar'/g, '\'replacedBar\'');
    },
    turnFakeBarToReplacedBar: function (source) {
      return source.replace(/'fakeBar'/g, '\'replacedFakeBar\'');
    }
  },
  sourceTransformersSingleOnly: true
});

var recursiveExports = requireModule.exports;
assert.strictEqual(recursiveExports.bar, 'replacedBar');
assert.strictEqual(recursiveExports.foo.bar, fakeBar);
