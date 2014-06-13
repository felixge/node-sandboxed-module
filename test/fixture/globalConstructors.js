// http://es5.github.com/#x15.1.1

var types = [
  Object, Function, Array, String, Boolean, Number, Date, RegExp, Error,
  EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError
];
types.forEach(function (constructor) {
  exports[constructor.name] = constructor;
});
