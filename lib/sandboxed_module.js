var requireLike = require('require-like');
var stackTrace = require('stack-trace');
var Module = require('module');
var fs = require('fs');
var vm = require('vm');
var path = require('path');

module.exports = SandboxedModule;
function SandboxedModule() {
  this.id = null;
  this.filename = null;
  this.module = null;
  this.exports = null;
  this.global = {};
  this.local = {};
  this.required = {};

  this._options = {};
}

SandboxedModule.load = function(moduleId, options) {
  var trace = stackTrace.get(SandboxedModule.load);

  var injectableModule = new SandboxedModule();
  injectableModule._init(moduleId, trace, options);

  return injectableModule;
};

SandboxedModule.prototype._init = function(moduleId, trace, options) {
  this.id = moduleId;
  this._resolveFilename(trace);

  this._options = options || {};

  var module = new Module(this.filename);
  module.filename = this.filename;

  this.module = module;
  this.exports = module.exports;

  this.local = this._getLocals();
  this.global = this._getGlobals();

  this._compile();
};

SandboxedModule.prototype._resolveFilename = function(trace) {
  var originPath = trace[0].getFileName();
  this.filename = requireLike(originPath).resolve(this.id);
};

SandboxedModule.prototype._getLocals = function() {
  var locals = {
    require: this._requireInterceptor(),
    __filename: this.filename,
    __dirname: path.dirname(this.filename),
    module: this.module,
    exports: this.exports,
  };

  for (var key in this._options.local) {
    locals[key] = this._options.local[key];
  }

  return locals;
};

SandboxedModule.prototype._getGlobals = function() {
  var globals = {};

  for (var key in global) {
    globals[key] = global[key];
  }

  globals.global = globals;
  globals.GLOBAL = globals;
  globals.root = globals;

  for (var key in this._options.global) {
    globals[key] = this._options.global[key];
  }

  return Object.create(globals, {});
};

SandboxedModule.prototype._requireInterceptor = function() {
  var requireProxy = requireLike(this.filename, true)
  var inject = this._options.require;
  var self = this;

  function requireInterceptor(request) {
    var exports = (inject && (request in inject))
      ? inject[request]
      : requireProxy(request);

    return self.required[request] = exports;
  }

  for (var key in requireProxy) {
    requireInterceptor[key] = requireProxy[key];
  }

  return requireInterceptor;
};

SandboxedModule.prototype._compile = function() {
  var compile = this._getCompileInfo();
  var compiledWrapper = vm.runInNewContext(
    compile.source,
    this.global,
    this.filename,
    true
  );

  return compiledWrapper.apply(this.exports, compile.parameters);
};

SandboxedModule.prototype._getCompileInfo = function() {
  var localVariables = [];
  var localValues = [];

  for (var localVariable in this.local) {
    localVariables.push(localVariable);
    localValues.push(this.local[localVariable]);
  }

  var source =
    '(function(' + localVariables.join(', ')  + ') { ' +
    fs.readFileSync(this.filename, 'utf8') +
    '\n});';

  return {source: source, parameters: localValues};
};
