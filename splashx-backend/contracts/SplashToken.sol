// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";

// import "@openzeppelin/token/ERC20/ERC20.sol";

contract SplashToken is ERC20 {
    address public treasury;

    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply
    ) ERC20(name, symbol) {
        // Mint `totalSupply` tokens to msg.sender
        // Similar to how
        // 1 dollar = 100 cents
        // 1 token = 1 * (10 ** decimals)
        treasury = msg.sender;
        _mint(msg.sender, totalSupply * 10 ** uint256(decimals()));
    }

    /**
@dev Apply a 1% tax on all transfers
@param from The address of the sender
@param to The address of the recipient
@param amount The amount of the sender
 */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        uint256 tax = (amount * 100) / 10_000;
        amount -= tax;
        super._transfer(from, treasury, tax);
        super._transfer(from, to, amount);
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == treasury, "Only treasury can mint");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(msg.sender == treasury, "Only treasury can burn");
        _burn(from, amount);
    }
}
