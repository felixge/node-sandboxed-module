
// Assert that we can load all the native modules
// FRAGILE: this tests that all the native modules we know about work
// FRAGILE: it doesn't test that the native_modules list is exhaustive

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var SandboxedModule = require('../..');

var temp = path.join(__dirname, 'temp');

fs.mkdir(temp, function (err) {
  if (err && err.code === 'EEXIST') {
    err = null; // ignore "directory already exists"
  }
  if (err) {
    throw err;
  }

  var nativeModules = require('../../lib/native_modules');
  assert.ok(nativeModules.length > 5, 'error discovering native modules');

  nativeModules.forEach(function (modName) {
    var filename = path.join(temp, 'fixture_'+modName+'.js');
    var requireName = './temp/fixture_'+modName;
    var content = 'module.exports.'+modName+' = require(\''+modName+'\');';

    // write a file that depends on this module
    fs.writeFile(filename, content, function (err) {
      if (err) {
        throw err;
      }

      // load that file
      var requireModule = SandboxedModule.require(requireName);
      // if we didn't die, we can load this module
      assert.ok(requireModule, modName + ' is blank'); // assert not blank
      if (modName !== 'module' && modName !== 'repl') { // no idea why these two are different
        assert.strictEqual(requireModule[modName], require(modName), modName + ' is different'); // assert we get the same result as just requiring it
      }

    });
  });
});
