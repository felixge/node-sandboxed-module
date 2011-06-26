var common = require('../common');
var assert = common.assert;
var SandboxedModule = require(common.dir.lib + '/sandboxed_module');

(function testRequireInjection() {
  var path = common.dir.fixture + '/require';
  var exports = SandboxedModule.load(path, {
    require: {'./foo': 'My Foo'},
  }).exports;

  assert.strictEqual(exports.bar, 'bar');
  assert.strictEqual(exports.foo, 'My Foo');
})();
