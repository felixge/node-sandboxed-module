var common = require('../common');
var assert = common.assert;
var SandboxedModule = require(common.dir.lib + '/sandboxed_module');

(function testGetGlobalLeaks() {
  var leakModule = SandboxedModule.load(common.dir.fixture + '/leak');
  assert.deepEqual(
    leakModule.getGlobalLeaks(),
    ['implicitLeak', 'explicitLeak']
  );
})();
