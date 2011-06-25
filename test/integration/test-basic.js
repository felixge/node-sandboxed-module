var common = require('../common');
var assert = common.assert;
var requireInject = require(common.dir.lib + '/require-inject');

(function testRequire() {
  var foo = requireInject('../fixture/foo');
  assert.strictEqual(foo.foo, 'foo');
  assert.strictEqual(foo.bar, 'bar');
})();
