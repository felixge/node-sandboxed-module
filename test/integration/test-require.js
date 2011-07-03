var common = require('../common');
var assert = common.assert;
var SandboxedModule = require(common.dir.lib + '/sandboxed_module');

(function testRequire() {
  var foo = SandboxedModule.require('../fixture/foo');
  assert.strictEqual(foo.foo, 'foo');
  assert.strictEqual(foo.bar, 'bar');
})();
