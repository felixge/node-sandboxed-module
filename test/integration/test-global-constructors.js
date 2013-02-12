var assert = require('assert');
var SandboxedModule = require('../..');

var exports = SandboxedModule.load('../fixture/globalConstructors').exports;

[
  Object, Function, Array, String, Boolean, Number, Date, RegExp, Error,
  EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError
].forEach(function (constructor) {
  assert.strictEqual(exports[constructor.name], constructor);
});
