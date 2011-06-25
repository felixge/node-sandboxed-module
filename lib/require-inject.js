var requireLike = require('require-like');
var stackTrace = require('stack-trace');
var Module = require('module');
var fs = require('fs');
var vm = require('vm');
var path = require('path');

module.exports = requireInject;
function requireInject(moduleId, options) {
  var modulePath = requireInject.resolve(moduleId, stackTrace.get(requireInject));

  var module = new Module(modulePath);
  module.filename = modulePath;

  var sandbox = requireInject.sandbox(module, options);
  requireInject.compile(module, sandbox);

  return module.exports;
};

requireInject.resolve = function(moduleId, trace) {
  var originPath = trace[0].getFileName();
  var modulePath = requireLike(originPath).resolve(moduleId);

  return modulePath;
};

requireInject.sandbox = function(module, options) {
  var sandbox = {
    module: module,
    exports: module.exports,
    require: requireLike(module.filename, true),
    __filename: module.filename,
    __dirname: path.dirname(module.filename),
  };

  for (var key in global) {
    sandbox[key] = global[key];
  }

  sandbox.global = sandbox;
  sandbox.GLOBAL = sandbox;
  sandbox.root = sandbox;

  return sandbox;
};

requireInject.compile = function(module, sandbox) {
  var source = fs.readFileSync(module.filename, 'utf8');
  return vm.runInNewContext(source, sandbox, module.filename, true);
};
