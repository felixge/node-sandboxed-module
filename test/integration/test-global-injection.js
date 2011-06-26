var common = require('../common');
var assert = common.assert;
var SandboxedModule = require(common.dir.lib + '/sandboxed_module');

(function testGlobalInjection() {
  var fakeProcess = {my: 'my process'};
  var globals = SandboxedModule.load(common.dir.fixture + '/global', {
    globals: {process: fakeProcess},
  }).exports;

  assert.strictEqual(globals.process, fakeProcess);
})();
