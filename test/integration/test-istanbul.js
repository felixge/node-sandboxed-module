var assert = require('assert');
var SandboxedModule = require('../..');
SandboxedModule.registerBuiltInSourceTransformer('istanbul');

var rawFunction = /^\s*function \(\){\s*return 1 \+ 3;\s*}\s*$/,
    instrumentedFunction = /^function \(\){__cov_.*\.f\['1'\]\+\+;__cov_.*\.s\['2'\]\+\+;return 1\+3;}$/;

function testIt(file, coverageVariable, functionMatch) {
    global[coverageVariable] = {};
    var baz = SandboxedModule.load(file).exports;

    assert.strictEqual(baz.biz.toString().match(functionMatch).length, 1);

    delete global[coverageVariable];
}

testIt('../fixture/baz', '$$cov_1234', instrumentedFunction);
testIt('../fixture/baz', '__coverage__', instrumentedFunction);

SandboxedModule.registerBuiltInSourceTransformer('istanbul', null, /.*filtered.*$/);
testIt('../fixture/baz', '$$cov_1234', rawFunction);
testIt('../fixture/baz', '__coverage__', rawFunction);
testIt('../fixture/filteredBaz', '$$cov_1234', instrumentedFunction);
testIt('../fixture/filteredBaz', '__coverage__', instrumentedFunction);
