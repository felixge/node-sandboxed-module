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
var user = SandboxedModule.load('./user', {
  requires: {'mysql': {fake: 'mysql module'}},
  globals: {myGlobal: 'variable'},
  locals: {myLocal: 'other variable'},
}).exports;
```

## What to do with this

This module is intended to ease dependency injection for unit testing. However,
feel free to use it for whatever crimes you can think of.

## API

### SandboxedModule.load(moduleId, [options])

Returns a new `SandboxedModule` where `moduleId` is a regular module path / id
as you would normally pass into `require()`. The new module will be loaded in
its own v8 context, but otherwise have access to the normal node.js
environment.

`options` is an optional object that can be used to inject any of the
following:

* `requires:` An object containing `moduleId`s and the values to inject for
  them when required by the sandboxed module. This does not affect children
  of the sandboxed module.
* `globals:` An object of global variables to inject into the sandboxed module.
* `locals:` An object of local variables to inject into the sandboxed module.

## License

sandboxed-module is licensed under the MIT license.
