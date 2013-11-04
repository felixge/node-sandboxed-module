var Module = require("module")

var parentModule = new Module(require.resolve("./foo"))
parentModule.filename = require.resolve("./foo")
module.exports.bar = Module._load("./bar",parentModule)