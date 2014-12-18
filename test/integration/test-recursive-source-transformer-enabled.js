var assert = require('assert');
var SandboxedModule = require('../..');

var requireModule = SandboxedModule.load('../fixture/require', {
  sourceTransformers: {
    turnBarToReplacedBar: function (source) {
      return source.replace(/module.exports = 'bar';/g, 'module.exports = \'replacedBar\'');
    }
  }
});

var recursiveExports = requireModule.exports;
assert.strictEqual(recursiveExports.bar, 'replacedBar');
assert.strictEqual(recursiveExports.foo.bar, 'replacedBar');
