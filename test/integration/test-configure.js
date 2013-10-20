var assert = require('assert');
var SandboxedModule = require('../..');

SandboxedModule.configure({
  globals: {
    someGlobal: 9
  },
  locals: {
    someLocal: 4
  },
  requires: {
    './foo': 1
  },
  sourceTransformers: {
    turn3sInto5s: function(source) {
      return source.replace(/3/g,'5');
    }
  }
});

SandboxedModule = require('../..');

var baz = SandboxedModule.load('../fixture/baz').exports;

assert.strictEqual(baz.bang(), 19);

