var common = require('../common');
var assert = common.assert;
var SandboxedModule = require(common.dir.lib + '/sandboxed_module');

(function testLocals() {
  var path = common.dir.fixture + '/parse_error';
  try {
    SandboxedModule.load(path);
  } catch (e) {
    console.log(e.message);
    console.log(e.stack);
    assert.ok((/parse_error\.js:1$/.test(e.message)));
  }
})();
