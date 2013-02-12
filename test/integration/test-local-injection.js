var assert = require('assert');
var SandboxedModule = require('../..');

var locals = SandboxedModule.load('../fixture/local', {
  locals: { __filename: 'my filename' }
}).exports;

assert.strictEqual(locals.__filename, 'my filename');
