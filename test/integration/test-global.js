var common = require('../common');
var assert = common.assert;
var SandboxedModule = require(common.dir.lib + '/sandboxed_module');

(function testGlobals() {
  var path = common.dir.fixture + '/global';
  var globalModule = SandboxedModule.load(path);
  var globals = globalModule.exports;

  assert.ok(globals.global);
  assert.strictEqual(globals.GLOBAL, globals.global);
  assert.strictEqual(globals.root, globals.global);

  for (var key in global) {
    if (/global|root/i.test(key)) {
      continue;
    }

    assert.strictEqual(globals[key], global[key], key);
  }
})();
