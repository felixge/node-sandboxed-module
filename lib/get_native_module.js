// Hack to get a reference to node's internal NativeModule
// from https://gist.github.com/Benvie/1841241
// see also https://github.com/joyent/node/blob/master/src/node.js#L762

var NativeModule;

// monkey patch
process.moduleLoadList.push = function(){
  // `NativeModule.require('native_module')` returns NativeModule
  NativeModule = arguments.callee.caller('native_module');

  // put it back
  delete process.moduleLoadList.push;
  return Array.prototype.push.apply(process.moduleLoadList, arguments);
};

// force an initial call to the interceptor
// FRAGILE: if this module was loaded previously, we'll just get the cached version
require('vm');
if (!NativeModule) {
  require('http');
}

module.exports.NativeModule = NativeModule;
