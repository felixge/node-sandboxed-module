# sandboxed-module

A sandboxed node.js module loader that lets you inject dependencies into your
modules.

## Installation

``` bash
npm install sandboxed-module
```

## Usage

``` javascript
var SandboxedModule = require('sandboxed-module');
var myModule = SandboxedModule.load('./my', {
  require: {'./foo': {fake: 'foo module'}},
  global: {myGlobal: 'variable'},
  local: {myLocal: 'other variable'},
});
```

## Use case

This module is intended to ease dependency injection for unit testing. However,
feel free to use it for whatever crimes you can think of.

## License

sandboxed-module is licensed under the MIT license.
