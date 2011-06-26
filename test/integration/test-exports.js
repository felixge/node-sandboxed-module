var common = require('../common');
var assert = common.assert;
var SandboxedModule = require(common.dir.lib + '/sandboxed_module');

(function testGlobalInjection() {
  var exports = SandboxedModule.load(common.dir.fixture + '/exports').exports;
  assert.strictEqual(exports, 'overwritten');
})();
