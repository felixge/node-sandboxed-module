var assert = require('assert');
var SandboxedModule = require('../..');

var exports = SandboxedModule.load('../fixture/stayStrict').exports;

assert(exports() === undefined);
