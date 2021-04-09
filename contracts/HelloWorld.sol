// SPDX-License-Identifier: MIT
pragma solidity >= 0.4.0;

contract HelloWorld {

    address private owner;
    string private ownerWebsite;
    string private message;

    constructor(string memory _ownerWebsite, string memory _message) {
        owner = msg.sender;
        ownerWebsite = _ownerWebsite;
        message = _message;
    }

    function helloFromOwner() public view returns (string memory) {
        return string(abi.encodePacked("Hello from ", ownerWebsite));
    }

    function getMessage() public view returns (string memory) {
        return message;
    }

    function setMessage(string memory _message) public returns (bool updated) {
        message = _message;
        return true;
    }
}