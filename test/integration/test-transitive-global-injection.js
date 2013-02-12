var assert = require('assert');
var SandboxedModule = require('../..');

var fakeProcess = { my: 'my process' };
var globals = SandboxedModule.load('../fixture/requiresGlobal', {
  globals: { process: fakeProcess }
}).exports;

assert(globals.process === fakeProcess);
