var assert = require('assert');
var SandboxedModule = require('../..');

assert.throws(function() {
    SandboxedModule.require('../fixture/nativeStub.node');
}, process.platform == 'win32' ? /not a valid Win32 application/i : /invalid ELF header/i);
