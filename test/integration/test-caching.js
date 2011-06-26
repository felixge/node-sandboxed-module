var common = require('../common');
var assert = common.assert;
var SandboxedModule = require(common.dir.lib + '/sandboxed_module');

(function testCache() {
  var path = common.dir.fixture + '/foo';
  var foo1 = SandboxedModule.load(path);
  var foo2 = SandboxedModule.load(path);

  assert.notStrictEqual(foo1.exports, foo2.exports);
  assert.deepEqual(foo1.exports, foo2.exports);
})();
