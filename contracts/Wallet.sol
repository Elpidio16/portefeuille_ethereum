// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Uncomment this line to use console.log
import "hardhat/console.sol";

// le contrat intellegent de notre wallet

contract Wallet {
    //lier les adresse des utilisateurs avec leur solde
    mapping(address => uint) public Wallets;
    
// fonction pour envoyer de l'argent
    function withdrawMoney(address payable _to, uint _amount) external {
        require(_amount <= Wallets[msg.sender], "Insufficient funds");
        Wallets[msg.sender] -= _amount;
        _to.transfer(_amount);

    } 
// fonction pour voir le solde de notre wallet
    function getBalance() external view returns (uint) {
        return Wallets[msg.sender];
    }

// fonction pour recevoir de l'argent
    receive() external payable {
        Wallets[msg.sender] += msg.value;
    }

// fonction pour envoyer de l'argent
    fallback() external payable {
       // wallets[msg.sender] += msg.value;
    }
}
