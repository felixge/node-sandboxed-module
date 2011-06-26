var requireLike = require('require-like');
var stackTrace = require('stack-trace');
var Module = require('module');
var fs = require('fs');
var vm = require('vm');
var path = require('path');

module.exports = InjectableModule;
function InjectableModule() {
  this.module = null;
  this.exports = null;
}

InjectableModule.load = function(moduleId, options) {
  var injectableModule = new InjectableModule();

  var modulePath = InjectableModule.resolve(moduleId, stackTrace.get(InjectableModule.load));
  options = options || {};

  var module = new Module(modulePath);
  module.filename = modulePath;

  var sandbox = InjectableModule.sandbox(module, options);
  InjectableModule.compile(module, sandbox);

  injectableModule.module = module;
  injectableModule.exports = module.exports;

  return injectableModule;
};

InjectableModule.resolve = function(moduleId, trace) {
  var originPath = trace[0].getFileName();
  var modulePath = requireLike(originPath).resolve(moduleId);

  return modulePath;
};

InjectableModule.sandbox = function(module, options) {
  var sandbox = {
    module: module,
    exports: module.exports,
    require: InjectableModule.requireInterceptor(module, options.require),
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

InjectableModule.requireInterceptor = function(module, inject) {
  var requireProxy = requireLike(module.filename, true)

  function requireInterceptor(request) {
    if (inject && (request in inject)) {
      return inject[request];
    }

    return requireProxy(request);
  }

  for (var key in requireProxy) {
    requireInterceptor[key] = requireProxy[key];
  }

  return requireInterceptor;
};

InjectableModule.compile = function(module, sandbox) {
  var source = fs.readFileSync(module.filename, 'utf8');
  return vm.runInNewContext(source, sandbox, module.filename, true);
};
