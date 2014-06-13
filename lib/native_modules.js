
// ['NativeModule assert', 'NativeModule buffer', 'Binding fs', ...]

var moduleLoadList = process.moduleLoadList;

var natives = moduleLoadList.map(function (item) {
  return item.split(' ');
}).filter(function (item) {
  return item && item.length === 2 && item[0] === 'NativeModule';
}).map(function (item) {
  return item[1];
});

if (natives.indexOf('repl') === -1) {
  natives.push('repl'); // No idea why repl doesn't show up in process.moduleLoadList
}

// ['assert, 'buffer', ...]

module.exports = natives;
