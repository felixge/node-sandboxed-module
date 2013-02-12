// http://es5.github.com/#x15.1.1

[
  Object, Function, Array, String, Boolean, Number, Date, RegExp, Error,
  EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError
].forEach(function (constructor) {
  exports[constructor.name] = constructor;
});
