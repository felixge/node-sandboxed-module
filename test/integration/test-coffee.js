var common = require('../common');
var assert = common.assert;
var SandboxedModule = require(common.dir.lib + '/sandboxed_module');

(function testRequire() {
  var hasCoffee = false;
  try {
    require('coffee-script');
    hasCoffee = true;
  } catch (e) {}

  if (hasCoffee) {
    var coffeeClass = SandboxedModule.load('../fixture/coffeeClass').exports;
    assert.strictEqual(new coffeeClass().simpleData(), 2);
  }
})();
