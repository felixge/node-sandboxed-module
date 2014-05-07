var assert = require('assert');
var SandboxedModule = require('../..');
SandboxedModule.registerBuiltInSourceTransformer('istanbul');

function testIt(coverageVariable) {
    global[coverageVariable] = {};
    var baz = SandboxedModule.load('../fixture/baz').exports,
        instrumentedFunction = /^function \(\){__cov_.*\.f\['1'\]\+\+;__cov_.*\.s\['2'\]\+\+;return 1\+3;}$/;

    assert.strictEqual(baz.biz.toString().match(instrumentedFunction).length, 1);

    delete global[coverageVariable];
}

testIt('$$cov_1234');
testIt('__coverage__');
