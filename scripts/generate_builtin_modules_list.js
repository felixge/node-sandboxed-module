// Stay in sloppy mode since we need `.caller` :(
var fs = require('fs');
var path = require('path');

// Based on https://gist.github.com/Benvie/1841241

var NativeModule;

// Intercept NativeModule.require's call to process.moduleLoadList.push
process.moduleLoadList.push = function newPush() {
  // `NativeModule.require('native_module')` returns NativeModule
  NativeModule = newPush.caller('native_module');

  // Delete the interceptor and forward normal functionality
  delete process.moduleLoadList.push;
  return Array.prototype.push.apply(process.moduleLoadList, arguments);
}

// Force an initial call to the interceptor
require('vm');

fs.writeFileSync(path.resolve(__dirname, '../lib/builtin_modules.json'), JSON.stringify(Object.keys(NativeModule._source), undefined, 2));
