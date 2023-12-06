// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
// import the escrow contract
import "./Escrow.sol";

contract EscrowFactory {
    struct EscrowDetails {
        address escrowAddress;
        address arbiter;
        address beneficiary;
        address depositor;
    }

    EscrowDetails[] public deployedContracts;

    event EscrowDeployed(address indexed escrowAddress, address indexed arbiter, address indexed beneficiary, address depositor);

    function createEscrow(address _arbiter, address _beneficiary) external payable {
        Escrow newEscrow = new Escrow{value: msg.value}(_arbiter, _beneficiary);
        EscrowDetails memory newEscrowDetails = EscrowDetails(address(newEscrow), _arbiter, _beneficiary, msg.sender);
        deployedContracts.push(newEscrowDetails);
        emit EscrowDeployed(address(newEscrow), _arbiter, _beneficiary, msg.sender);
    }

    function getDeployedContractsCount() external view returns (uint256) {
        return deployedContracts.length;
    }
}