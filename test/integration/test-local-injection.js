var common = require('../common');
var assert = common.assert;
var SandboxedModule = require(common.dir.lib + '/sandboxed_module');

(function testLocalInjection() {
  var locals = SandboxedModule.load(common.dir.fixture + '/local', {
    locals: {__filename: 'my filename'},
  }).exports;

  assert.strictEqual(locals.__filename, 'my filename');
})();
