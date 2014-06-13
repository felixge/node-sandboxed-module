
// process.moduleLoadList is the cache of requested native modules, not the exhaustive list
// so get NativeModule and ask for the list directly

var NativeModule = require('./get_native_module');
var natives = Object.keys(NativeModule.NativeModule._source);

module.exports = natives;
