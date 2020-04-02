var assert = require('assert');
var SandboxedModule = require('../..');

var baz = SandboxedModule.load('../fixture/baz', {
  sourceTransformers: {
    turn3sInto5s: function(source, filename) {
      assert.strictEqual(filename.match(/test\/fixture\/baz.js$/).length, 1);

      return source.replace(/3/g,'5');
    }
  }
}).exports;

assert.strictEqual(baz.biz(), 6);

