var assert = require('assert');
var SandboxedModule = require('../..');

var foo = SandboxedModule.require('../fixture/builtinModules', {
    requires: { './bar': 'fakeBar' }
});

assert.ok(foo);
