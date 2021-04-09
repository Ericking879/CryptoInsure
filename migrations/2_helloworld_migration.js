const HelloWorld = artifacts.require("HelloWorld");
var ownerWebsite = "www.suneshan.com";
var message = "This is exciting!";
module.exports = function (deployer) {
      deployer.deploy(HelloWorld, ownerWebsite, message);
};