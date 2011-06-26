var common = require('../common');
var assert = common.assert;
var InjectableModule = require(common.dir.lib + '/injectable_module');

(function testRequire() {
  var foo = InjectableModule.load('../fixture/foo').exports;
  assert.strictEqual(foo.foo, 'foo');
  assert.strictEqual(foo.bar, 'bar');
})();
