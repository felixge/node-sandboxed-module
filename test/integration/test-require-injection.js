var common = require('../common');
var assert = common.assert;
var SandboxedModule = require(common.dir.lib + '/sandboxed_module');

(function testRequireInjection() {
  var fakeFoo = {my: 'foo module'};
  var requireModule = SandboxedModule.load(common.dir.fixture + '/require', {
    requires: {'./foo': fakeFoo},
  });
  var exports = requireModule.exports;

  assert.strictEqual(exports.bar, 'bar');
  assert.strictEqual(exports.foo, fakeFoo);

  assert.strictEqual(requireModule.required['./foo'], fakeFoo);
  assert.strictEqual(requireModule.required['./bar'], 'bar');
})();
