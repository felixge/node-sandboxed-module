var common = require('../common');
var assert = common.assert;
var InjectableModule = require(common.dir.lib + '/injectable_module');

(function testRequireInjection() {
  var path = common.dir.fixture + '/require';
  var exports = InjectableModule.load(path, {
    require: {'./foo': 'My Foo'},
  }).exports;

  assert.strictEqual(exports.bar, 'bar');
  assert.strictEqual(exports.foo, 'My Foo');
})();
