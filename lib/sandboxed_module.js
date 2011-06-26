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
  this.globals = {};
  this.locals = {};
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

  this.locals = this._getLocals();
  this.globals = this._getGlobals();

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

  for (var key in this._options.locals) {
    locals[key] = this._options.locals[key];
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

  for (var key in this._options.globals) {
    globals[key] = this._options.globals[key];
  }

  return Object.create(globals, {});
};

SandboxedModule.prototype._requireInterceptor = function() {
  var requireProxy = requireLike(this.filename, true)
  var inject = this._options.requires;
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
    this.globals,
    this.filename,
    true
  );

  return compiledWrapper.apply(this.exports, compile.parameters);
};

SandboxedModule.prototype._getCompileInfo = function() {
  var localVariables = [];
  var localValues = [];

  for (var localVariable in this.locals) {
    localVariables.push(localVariable);
    localValues.push(this.locals[localVariable]);
  }

  var source =
    '(function(' + localVariables.join(', ')  + ') { ' +
    fs.readFileSync(this.filename, 'utf8') +
    '\n});';

  return {source: source, parameters: localValues};
};
