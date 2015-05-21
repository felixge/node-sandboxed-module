var assert = require('assert');
var SandboxedModule = require('../..');

assert.throws(function() {
    SandboxedModule.require('../fixture/recursiveNative');
}, process.platform == 'win32' ? /not a valid Win32 application/i : /invalid ELF header/i);
