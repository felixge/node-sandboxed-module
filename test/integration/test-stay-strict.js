var common = require('../common');
var assert = common.assert;
var SandboxedModule = require(common.dir.lib + '/sandboxed_module');

(function testStayStrict() {
  var exports = SandboxedModule.load(common.dir.fixture + '/stayStrict').exports;

  assert(exports() === undefined);
})();
