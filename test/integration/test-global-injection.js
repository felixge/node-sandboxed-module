var assert = require('assert');
var SandboxedModule = require('../..');

var fakeProcess = { my: 'my process' };
var globals = SandboxedModule.load('../fixture/global', {
  globals: { process: fakeProcess }
}).exports;

assert.strictEqual(globals.process, fakeProcess);
