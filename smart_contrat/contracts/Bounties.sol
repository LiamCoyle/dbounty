// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Bounties is Ownable {
  struct Bounty {
    string title;
    string description;
    address author;
    uint256 balance;
    uint256 deadline;
    bool isOpen;
    bool isActive;
    bool isOver;
    uint256 nbTransaction;
    uint256 nbProof;
    uint256 approvedProof;
  }

  struct Proof {
    string content;
    address author;
    uint256 date;
    bool isApproved;
  }

  struct Transaction {
    address source;
    int256 balance;
    uint256 date;
  }

  Bounty[] public bounties;

  mapping(uint256 => Transaction[]) public transactions;
  mapping(uint256 => Proof[]) private proofs;
  mapping(address => mapping(uint256 => uint256)) public balances;

  event Withdraw(
    address addr,
    uint256 idBounty,
    uint256 idTransaction,
    uint256 balance
  );
  event Deposit(
    address addr,
    uint256 idBounty,
    uint256 idTransaction,
    uint256 balance
  );
  event CreateBounty(
    address author,
    string title,
    uint256 idBounty,
    uint256 balance
  );
  event UpdateBounty(address author, uint256 idBounty);
  event SubmitProof(address author, uint256 idBounty, uint256 idProof);
  event ApproveProof(address author, uint256 idBounty, uint256 idProof);

  function deposit() external payable {}

  function create(
    string memory _title,
    string memory _description,
    uint256 _deadline,
    bool _isOpen,
    bool _isActive
  ) external payable {
    Bounty memory bounty;
    bounty.title = _title;
    bounty.author = msg.sender;
    bounty.balance = _deadline;
    bounty.description = _description;
    bounty.isOpen = _isOpen;
    bounty.isActive = _isActive;
    bounty.isOver = false;

    bounties.push(bounty);

    if (msg.value > 0) {
      Transaction memory transaction;
      transaction.source = msg.sender;
      transaction.balance = int256(msg.value);
      transaction.date = block.timestamp;
      transactions[bounties.length - 1].push(transaction);

      bounties[bounties.length - 1].nbTransaction++;

      balances[msg.sender][bounties.length - 1] = msg.value;
    }
    emit CreateBounty(msg.sender, _title, bounties.length - 1, msg.value);
  }

  function update(
    uint256 _id,
    string memory _title,
    string memory _description,
    uint256 _deadline,
    bool _isActive
  ) external {
    require(
      bounties[_id].author == msg.sender,
      "You are not the author of the bounty, only the author can update the bounty"
    );
    require(
      !bounties[_id].isActive,
      "Bounty is active, cannot update bounty once activated"
    );
    bounties[_id].title = _title;
    bounties[_id].description = _description;
    bounties[_id].deadline = _deadline;
    bounties[_id].isActive = _isActive;

    emit UpdateBounty(msg.sender, _id);
  }

  function depositBalanceToBounty(uint256 _id) external payable {
    require(!bounties[_id].isOver, "Bounty is over");
    require(
      bounties[_id].author == msg.sender || bounties[_id].isOpen,
      "You are not the author of the bounty, only the author can add to the bounty"
    );

    transactions[_id][bounties[_id].nbTransaction].source = msg.sender;
    transactions[_id][bounties[_id].nbTransaction].balance = int256(msg.value);
    transactions[_id][bounties[_id].nbTransaction].date = block.timestamp;

    bounties[_id].nbTransaction++;

    bounties[_id].balance += msg.value;
    balances[msg.sender][_id] += msg.value;

    emit Deposit(msg.sender, _id, transactions[_id].length - 1, msg.value);
  }

  function withdrawBalanceFromBounty(uint256 _id, uint256 _balance) external {
    require(!bounties[_id].isOver, "Bounty is over");
    require(
      balances[msg.sender][_id] >= _balance,
      "Cannot withdraw more than available"
    );
    require(
      !bounties[_id].isActive || block.timestamp > bounties[_id].deadline,
      "Bounty is active, cannot withdraw until deadline"
    );
    transactions[_id][bounties[_id].nbTransaction].source = msg.sender;
    transactions[_id][bounties[_id].nbTransaction].balance = -int256(_balance);
    transactions[_id][bounties[_id].nbTransaction].date = block.timestamp;

    bounties[_id].nbTransaction++;

    bounties[_id].balance -= _balance;
    balances[msg.sender][_id] -= _balance;
    payable(msg.sender).transfer(_balance);

    emit Withdraw(msg.sender, _id, transactions[_id].length - 1, _balance);
  }

  function submitProof(uint256 _id, string memory _content) external {
    require(!bounties[_id].isOver, "Bounty is over");
    require(
      bounties[_id].isActive,
      "Bounty is not active, cannot submit proof"
    );
    require(
      bounties[_id].deadline < block.timestamp,
      "Bounty is passed the deadline, cannot submit proof"
    );
    proofs[_id][bounties[_id].nbProof].content = _content;
    proofs[_id][bounties[_id].nbProof].author = msg.sender;
    proofs[_id][bounties[_id].nbProof].date = block.timestamp;
    proofs[_id][bounties[_id].nbProof].isApproved = false;

    bounties[_id].nbProof++;

    emit SubmitProof(msg.sender, _id, proofs[_id].length - 1);
  }

  function approveProof(uint256 _idBounty, uint256 _idProof) external {
    require(!bounties[_idBounty].isOver, "Bounty is over");
    require(
      bounties[_idBounty].author == msg.sender,
      "Only the author of the bounty can approve a proof"
    );
    require(
      bounties[_idBounty].isActive,
      "Bounty must be active to approve the proof"
    );

    proofs[_idBounty][_idProof].isApproved = true;
    bounties[_idBounty].approvedProof = _idProof;
    bounties[_idBounty].isActive = false;
    bounties[_idBounty].isOver = true;

    payable(proofs[_idBounty][_idProof].author).transfer(
      bounties[_idBounty].balance
    );

    emit ApproveProof(msg.sender, _idBounty, _idProof);
  }

  function getActiveBounties() external view returns (Bounty[] memory) {
    Bounty[] memory activeBounties = new Bounty[](bounties.length);
    uint256 count = 0;
    for (uint256 i = 0; i < bounties.length; i++) {
      if (bounties[i].isActive == true) {
        activeBounties[count] = bounties[i];
        count++;
      }
    }
    return activeBounties;
  }

  function getAllBounties() external view returns (Bounty[] memory) {
    return bounties;
  }

  function getProofs(uint256 _id) external view returns (Proof[] memory) {
    require(
      msg.sender == bounties[_id].author,
      "Must be the author of the bounty to see the proofs"
    );
    return proofs[_id];
  }
}
