var assert = require('assert');
var SandboxedModule = require('../..');
SandboxedModule.registerBuiltInSourceTransformer('istanbul');

global['$$cov_1234'] = {};
var baz = SandboxedModule.load('../fixture/baz').exports,
    instrumentedFunction = /^function \(\){__cov_.*\.f\['1'\]\+\+;__cov_.*\.s\['2'\]\+\+;return 1\+3;}$/;

assert.strictEqual(baz.biz.toString().match(instrumentedFunction).length, 1);

delete global['$$cov_1234'];
