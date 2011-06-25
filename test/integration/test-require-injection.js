var common = require('../common');
var assert = common.assert;
var requireInject = require(common.dir.lib + '/require-inject');

(function testRequireInjection() {
  var path = common.dir.fixture + '/require';
  var exports = requireInject(path, {
    require: {'./foo': 'My Foo'},
  });

  assert.strictEqual(exports.bar, 'bar');
  assert.strictEqual(exports.foo, 'My Foo');
})();
