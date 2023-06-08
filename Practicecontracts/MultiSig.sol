// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//Practice contract for a multisig wallet
contract MultiSig {

//globalvariables
    address[] public owners; //addresses that can sign transactions
    uint256 public required; // # of required signatures to approve a transaction
    uint256 public transactionCount; // transaction counter
    struct Transaction { //stores transaction info
        address recipient;
        uint256 value;
        bool executed;
        bytes data;
    }

    mapping(uint256 => Transaction) public transactions; //keeps track of transactions by id
    mapping(uint256 => mapping(address => bool)) public confirmations; //keeps track of 

//events
    event TransactionCreated(address indexed creator, uint256 id);
    event DepositReceived(address indexed sender, uint256 amount);
    event TransactionExecution(address indexed recipient, uint256 id, uint256 amount);

    constructor(address[] memory _owners, uint256 _required) {
        require(_owners.length > 0, "At least one owner address needs to be declared");
        require(_required > 0, "At least one signature confirmation is required");
        require(_required <= _owners.length, "Required signatures must me equal or lower to the amount of owners");
        owners = _owners;
        required = _required;
    }

//Functions
    receive() payable external { //Accepts deposits
        emit DepositReceived(msg.sender, msg.value);
    }

    function isOwner(address _address) public view returns(bool) { //function to check if the address sending a mesage is the owner
        for(uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function getConfirmationsCount(uint256 _id) public view returns(uint256) { //counts the number of adresses that have confirmed a transaction
        uint256 _confirmations;
        for(uint256 i = 0; i < owners.length; i++) {
            if(confirmations[_id][owners[i]] == true) {
                _confirmations = _confirmations + 1;
            }
        }
        return _confirmations;
    }

    function isConfirmed(uint256 _id) public view returns(bool) { //checks if a transaction has enough signatures to be confirmed
        if (getConfirmationsCount(_id) >= required) {
            return true;
        } else {
            return false;
        }
    }

    function addTransaction(address _recipient, uint256 _value, bytes calldata _data) internal returns(uint256) { //adds a new transaction
        uint256 _thisTransaction = transactionCount; // is base 0
        transactionCount = transactionCount + 1;
        //sets parameters of transaction
        transactions[_thisTransaction].recipient = _recipient;
        transactions[_thisTransaction].value = _value;
        transactions[_thisTransaction].executed = false;
        transactions[_thisTransaction].data = _data;
        emit TransactionCreated(msg.sender, _thisTransaction);
        return _thisTransaction;

    }

    function confirmTransaction(uint256 _id) public { //confirms a transaction
        require(isOwner(msg.sender) == true, "Only owners can confirm transactions");
        confirmations[_id][msg.sender] = true;
        if (isConfirmed(_id) == true) { // executes the transaction if enough signatures have been accumulated
            executeTransaction(_id);
        }
    }

    function submitTransaction(address _recipient, uint256 _value, bytes calldata _data) external { //creates a transaction and signs it
        require(isOwner(msg.sender) == true, "Only owners can confirm transactions");
        uint256 _thisTransaction = addTransaction(_recipient, _value, _data);
        confirmTransaction(_thisTransaction);
    }

    function executeTransaction(uint256 _id) public { //executes a transaction
        require(transactions[_id].executed == false, "transaction has already beed executed"); // avoids double entry
        require(isConfirmed(_id) == true, "Transaction does not have the amount of signatures to be confirmed");
        require(address(this).balance >= transactions[_id].value, "Insufficient contract balance");
        (bool success, ) = transactions[_id].recipient.call{ value: transactions[_id].value }(transactions[_id].data);
        require(success, "Failed to execute transaction");
        transactions[_id].executed = true;
        emit TransactionExecution(transactions[_id].recipient, _id, transactions[_id].value);
    }
    
}
