// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
  address owner;
  uint256 deadline;
  uint256 goal;
  mapping(address => uint256) public pledgeOf;

  constructor(uint256 numberOfDays, uint256 _goal) {
    owner = msg.sender;
    deadline = block.timestamp + (numberOfDays * 1 days);
    goal = _goal;
  }

  function pledge(uint256 amount) public payable {
    require(block.timestamp < deadline);
    require(msg.value == amount);

    pledgeOf[msg.sender] += amount;
  }

  function claimFounds() public {
    require(address(this).balance >= goal);
    require(block.timestamp >= deadline);
    require(msg.sender == owner);

    payable(msg.sender).transfer(address(this).balance);
  }

  function getRefund() public {
    require(address(this).balance < goal);
    require(block.timestamp >= deadline);

    uint256 amount = pledgeOf[msg.sender];
    pledgeOf[msg.sender] = 0;
    payable(msg.sender).transfer(amount);
  }
}