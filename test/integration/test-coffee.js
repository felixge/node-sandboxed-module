var common = require('../common');
var assert = common.assert;
var SandboxedModule = require(common.dir.lib + '/sandboxed_module');

(function testRequire() {
  var test = require('../fixture/coffeeClass');
  console.log(new test().simpleData());
  var coffeeClass = SandboxedModule.load('../fixture/coffeeClass').exports;
  assert.strictEqual(new coffeeClass().simpleData(), 2);
})();