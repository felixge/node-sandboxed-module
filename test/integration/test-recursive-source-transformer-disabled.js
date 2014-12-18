var assert = require('assert');
var SandboxedModule = require('../..');

var requireModule = SandboxedModule.load('../fixture/require', {
  sourceTransformers: {
    turnBarToReplacedBar: function (source) {
      return source.replace(/module.exports = 'bar';/g, 'module.exports = \'replacedBar\'');
    }
  },
  sourceTransformersSingleOnly: true
});

var recursiveExports = requireModule.exports;
assert.strictEqual(recursiveExports.bar, 'bar');
assert.strictEqual(recursiveExports.foo.bar, 'bar');
