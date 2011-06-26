var common = require('../common');
var assert = common.assert;
var SandboxedModule = require(common.dir.lib + '/sandboxed_module');

(function testLocals() {
  var path = common.dir.fixture + '/local';
  var localModule = SandboxedModule.load(path);
  var locals = localModule.exports;

  for (var key in localModule.local) {
    assert.ok(locals[key], key + ' is local');
    assert.ok(!localModule.global[key], key + ' is not global');
  }
})();
