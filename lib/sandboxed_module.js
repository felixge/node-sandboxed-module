var requireLike = require('require-like');
var stackTrace = require('stack-trace');
var Module = require('module');
var fs = require('fs');
var vm = require('vm');
var path = require('path');
var builtinModules = require('./builtin_modules.json');
var parent = module.parent;
var globalOptions = {};
var registeredBuiltInSourceTransformers = ['coffee'];

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
  sandboxedModule._compile()
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
  if (this._options.sourceTransformersSingleOnly === undefined) {
    this._options.sourceTransformersSingleOnly = this._options.singleOnly;
  }

  var module = new Module(this.filename, parent);
  module.filename = this.filename;

  this.module = module;

  this.globals = this._getGlobals();
  //globals must be set before locals to share global state
  this.locals = this._getLocals();
  this.sourceTransformers = this._getSourceTransformers();
};

SandboxedModule.prototype._resolveFilename = function(trace) {
  var originPath = trace[0].getFileName();
  this.filename = requireLike(originPath).resolve(this.id);
};

SandboxedModule.prototype._getLocals = function() {
  var locals = {
    __filename: this.filename,
    __dirname: path.dirname(this.filename),
    module: this.module,
    exports: this.exports
  };
  //must be initialized after exports, or cyclic dependencies won't work
  locals.require = this._requireInterceptor()

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

function bindRequire(proxy, sandboxedModule) {
  var req = proxy.bind(sandboxedModule);
  req.main = require.main;
  req.resolve = requireLike(sandboxedModule.filename).resolve;
  req.extensions = require.extensions;
  req.registerExtensions = require.registerExtensions;
  return req;
}
SandboxedModule.prototype._createRecursiveRequireProxy = function() {
  var cache = Object.create(null);
  var required = this._getRequires();
  for (var key in required) {
    var injectedFilename = requireLike(this.filename).resolve(key);
    cache[injectedFilename] = required[key];
  }
  cache[this.filename] = this.exports;
  var globals = this.globals;

  var options;
  if(!this._options.sourceTransformersSingleOnly && this._options.sourceTransformers){
    options = {
      sourceTransformers: this._options.sourceTransformers
    };
  }

  function createInnerSandboxedModule(requestedFilename){
      // load nested dependency in sandboxed module
      var sandboxedModule = new SandboxedModule();
      sandboxedModule._getGlobals = function(){return globals};
      var trace = stackTrace.get(createInnerSandboxedModule);
      sandboxedModule._init(requestedFilename,trace, options);
      var proxyRequire = bindRequire(RecursiveRequireProxy,sandboxedModule);
      sandboxedModule.locals.require = proxyRequire;
      sandboxedModule.module.require = proxyRequire
      cache[requestedFilename] = sandboxedModule.exports;
      sandboxedModule._compile();
      cache[requestedFilename] = sandboxedModule.exports;
      return sandboxedModule;
  }
  function createFakeModuleModule(){
      var realModule = require("module");
      var fakeModule = function(){
          realModule.apply(this,Array.prototype.slice.call(arguments,0));
      }
      Object.keys(realModule).forEach(function(key){
          fakeModule[key] = realModule[key];
      })
      fakeModule._load = function(file,parentModule){
          var sandboxedModule = createInnerSandboxedModule(parentModule.filename);
          return RecursiveRequireProxy.bind(sandboxedModule)(file);
      }
      return fakeModule;
  }
  function RecursiveRequireProxy(request){
    //core modules:
    if (request == "module") {
  		//the module Module can also be used to require, so need special care
      return createFakeModuleModule();
    }
    if (builtinModules.indexOf(request) >= 0) {
      if (request in cache) return cache[request];
      return require(request);
    }
    // cached modules
    var requestedFilename = requireLike(this.filename).resolve(request);
    if (requestedFilename in cache) return cache[requestedFilename];
    var sandboxedModule = createInnerSandboxedModule(requestedFilename)
    return sandboxedModule.exports;
  }
  return RecursiveRequireProxy.bind(this);
}
SandboxedModule.prototype._requireInterceptor = function() {
  var requireProxy = this._options.singleOnly? requireLike(this.filename, true):this._createRecursiveRequireProxy();
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
  var wrappedRequire = bindRequire(requireInterceptor,this);
  this.module.require = wrappedRequire;
  return wrappedRequire;
};

SandboxedModule.prototype._compile = function() {
  if (/\.json|\.node$/.test(this.filename)) {
    this.module.exports = require(this.filename);
    return;
  }
  var compile = this._getCompileInfo();
  var compiledWrapper = vm.runInNewContext(
    compile.source,
    this.globals,
    this.filename
  );
  compiledWrapper.apply(this.exports, [this.globals].concat(compile.parameters));
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

  // remove shebang
  sourceToWrap = sourceToWrap.replace(/^\#\!.*/, '');

  var source =
    '(function(global,' + localVariables.join(', ')  + ') { ' +
    sourceToWrap +
    '\n});';

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
    if (this.filename.search(/\.coffee$/) !== -1){
      return require('coffee-script').compile(source);
    } else {
      return source;
    }
  },
  istanbul: function(source) {
    var coverageVariable, istanbulCoverageMayBeRunning = false;
    Object.keys(global).forEach(function(name) {
      if((name.indexOf("$$cov_") === 0 || name === '__coverage__') && global[name]) {
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
