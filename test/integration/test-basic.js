var common = require('../common');
var assert = common.assert;
var SandboxedModule = require(common.dir.lib + '/sandboxed_module');

(function testRequire() {
  var foo = SandboxedModule.load('../fixture/foo').exports;
  assert.strictEqual(foo.foo, 'foo');
  assert.strictEqual(foo.bar, 'bar');
})();
