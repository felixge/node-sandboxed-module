//jshint node:true
'use strict';

// ordinarily I'd use lodash, but let's use native to avoid the dependency

var moduleLoadList = process.moduleLoadList;
// an array of 'NativeModule assert'

var natives = moduleLoadList.map(function (item) {
	// split by space
	return item.split(' ');
}).filter(function (item) {
	// filter out invalid entries (if any)
	// filter out non 'NativeModule' like 'Binding'
	// filter out hidden modules (start with _)
	return item && item.length === 2 && item[0] === 'NativeModule' && item[1][0] !== '_';
}).map(function (item) {
	// grab the name
	return item[1];
});

if (natives.indexOf('repl') === -1) {
	natives.push('repl'); // No idea why repl doesn't show up in process.moduleLoadList
}

module.exports = natives;
