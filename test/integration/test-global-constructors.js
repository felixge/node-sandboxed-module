var common = require('../common');
var assert = common.assert;
var SandboxedModule = require(common.dir.lib + '/sandboxed_module');

(function testGlobalConstructors() {
  var exports = SandboxedModule.load(common.dir.fixture + '/globalConstructors').exports;

  [
    Object, Function, Array, String, Boolean, Number, Date, RegExp, Error,
    EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError
  ].forEach(function (constructor) {
    assert.strictEqual(exports[constructor.name], constructor);
  });

})();
