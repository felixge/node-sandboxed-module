var assert = require('assert'),
    SandboxedModule = require('../..'),
    blanket = require('blanket')({
      pattern: "/baz"
    });

var baz1 = SandboxedModule.load('../fixture/baz').exports;
assert(baz1.biz.toString().indexOf(global._blanket.getCovVar()) === -1);

SandboxedModule.registerBuiltInSourceTransformer('blanket');

var baz2 = SandboxedModule.load('../fixture/baz').exports;
assert(baz2.biz.toString().indexOf(global._blanket.getCovVar()) !== -1);
