'use strict';
var fs = require('fs');
var path = require('path');

fs.writeFileSync(path.resolve(__dirname, '../lib/builtin_modules.json'), JSON.stringify(Object.keys(process.binding('natives')), undefined, 2));
