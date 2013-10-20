var requireLike = require('require-like');
var stackTrace = require('stack-trace');
var Module = require('module');
var fs = require('fs');
var vm = require('vm');
var path = require('path');
var parent = module.parent;
var globalOptions = {};
var registeredBuiltInSourceTransformers = ['coffee']

module.exports = SandboxedModule;
function SandboxedModule() {
  this.id = null;
  this.filename = null;
  this.module = null;
  this.globals = {};
  this.locals = {};
  this.required = {};
  this.sourceTransformers = {};

  this._options = {};
}

SandboxedModule.load = function(moduleId, options, trace) {
  trace = trace || stackTrace.get(SandboxedModule.load);

  var sandboxedModule = new SandboxedModule();
  sandboxedModule._init(moduleId, trace, options);

  return sandboxedModule;
};

SandboxedModule.require = function(moduleId, options) {
  var trace = stackTrace.get(SandboxedModule.require);
  return this.load(moduleId, options, trace).exports;
};

SandboxedModule.configure = function(options) {
  Object.keys(options).forEach(function(name) {
    globalOptions[name] = options[name];
  });
};

SandboxedModule.registerBuiltInSourceTransformer = function(name) {
  if(registeredBuiltInSourceTransformers.indexOf(name) === -1) {
    registeredBuiltInSourceTransformers.push(name)
  }
};


Object.defineProperty(SandboxedModule.prototype, 'exports', {
  enumerable: true,
  configurable: true,
  get: function () {
    return this.module.exports;
  }
});

SandboxedModule.prototype._init = function(moduleId, trace, options) {
  this.id = moduleId;
  this._resolveFilename(trace);

  this._options = options || {};

  var module = new Module(this.filename, parent);
  module.filename = this.filename;

  this.module = module;

  this.locals = this._getLocals();
  this.globals = this._getGlobals();
  this.sourceTransformers = this._getSourceTransformers();

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
    exports: this.exports
  };

  for (var globalKey in globalOptions.locals) {
    locals[globalKey] = globalOptions.locals[globalKey];
  }

  for (var key in this._options.locals) {
    locals[key] = this._options.locals[key];
  }

  return locals;
};

SandboxedModule.prototype._getGlobals = function() {
  var globals = getStartingGlobals();

  for (var globalKey in global) {
    globals[globalKey] = global[globalKey];
  }

  for (var globalOptionKey in globalOptions.globals) {
    globals[globalOptionKey] = globalOptions.globals[globalOptionKey];
  }

  for (var optionsGlobalsKey in this._options.globals) {
    globals[optionsGlobalsKey] = this._options.globals[optionsGlobalsKey];
  }

  return globals;
};

SandboxedModule.prototype._getSourceTransformers = function() {
  var sourceTransformers = getStartingSourceTransformers();

  for (var globalKey in globalOptions.sourceTransformers) {
    sourceTransformers[globalKey] = globalOptions.sourceTransformers[globalKey];
  }

  for (var userKey in this._options.sourceTransformers) {
    sourceTransformers[userKey] = this._options.sourceTransformers[userKey];
  }

  return sourceTransformers;
};

SandboxedModule.prototype._getRequires = function() {
  var requires = this._options.requires || {};

  for (var key in globalOptions.requires) {
    requires[key] = globalOptions.requires[key];
  }

  return requires;
};

SandboxedModule.prototype._requireInterceptor = function() {
  var requireProxy = requireLike(this.filename, true);
  var inject = this._getRequires();
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
    this.filename
  );

  this.globals = compiledWrapper.apply(this.exports, compile.parameters);
};

SandboxedModule.prototype._getCompileInfo = function() {
  var localVariables = [];
  var localValues = [];

  for (var localVariable in this.locals) {
    localVariables.push(localVariable);
    localValues.push(this.locals[localVariable]);
  }

  var sourceToWrap = Object.keys(this.sourceTransformers).reduce(function(source, name){
    return this.sourceTransformers[name].bind(this)(source);
  }.bind(this), fs.readFileSync(this.filename, 'utf8'));

  var source =
    'global = GLOBAL = root = (function() { return this; })();' +
    '(function(' + localVariables.join(', ')  + ') { ' +
    sourceToWrap +
    '\n' +
    'return global;\n' +
    '});';

  return {source: source, parameters: localValues};
};

function getStartingGlobals() {
  return {
    Object: Object,
    Function: Function,
    Array: Array,
    String: String,
    Boolean: Boolean,
    Number: Number,
    Date: Date,
    RegExp: RegExp,
    Error: Error,
    EvalError: EvalError,
    RangeError: RangeError,
    ReferenceError: ReferenceError,
    SyntaxError: SyntaxError,
    TypeError: TypeError,
    URIError: URIError
  };
}

function getStartingSourceTransformers() {
  var sourceTransformers = {};

  registeredBuiltInSourceTransformers.forEach(function(name){
    sourceTransformers[name] = builtInSourceTransformers[name];
  });

  return sourceTransformers;
}

var builtInSourceTransformers = {
  coffee: function(source) {
    if (this.filename.search('.coffee$') !== -1){
      return require('coffee-script').compile(source);
    } else {
      return source;
    }
  },
  istanbul: function(source) {
    var coverageVariable, istanbulCoverageMayBeRunning = false;
    Object.keys(global).forEach(function(name) {
      if(name.indexOf("$$cov_") == 0 && global[name]) {
        istanbulCoverageMayBeRunning = true;
        coverageVariable = name;
      }
    });

    if(istanbulCoverageMayBeRunning) {
      try {
        var istanbul = require('istanbul'),
            instrumenter = new istanbul.Instrumenter({coverageVariable: coverageVariable}),
            instrumentMethod = instrumenter.instrumentSync.bind(instrumenter);
        source = instrumentMethod(source, this.filename);
      } catch(e) {}
    }
    return source;
  }
};
