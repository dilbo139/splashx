// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "forge-std/Test.sol";
import "../contracts/SplashToken.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";

contract SplashxTokenTest is Test {
    address public alice = address(0x1);
    address public bob = address(0x2);
    address public treasury = address(0x3);
    SplashToken public token;
    address public constant superToken =
        0x8276d9e3FD953Ec79D27437E3FA988bA78835754;

    /// @notice Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    function setUp() public {
        token = new SplashToken("Splash", "SPLSH", 100000000);
    }

    function testName() public {
        assertEq(token.name(), "Splash");
    }

    function testSymbol() public {
        assertEq(token.symbol(), "SPLSH");
    }

    function testTotalSupply() public {
        assertEq(token.totalSupply(), 100000000 * 1e18);
    }

    function testTransferFromToken() public {
        address sender = address(this);
        uint256 amount = 50;

        vm.expectEmit(true, true, false, true);
        emit Approval(sender, sender, amount);
        token.approve(sender, amount);

        vm.expectEmit(true, true, false, true);
        emit Transfer(sender, bob, amount);
        token.transferFrom(sender, bob, amount);

        uint256 bobBalance = token.balanceOf(bob);
        assertEq(bobBalance, amount);
    }

    function testTransferToken() public {
        uint256 amount = 200;
        uint256 tax = (amount * 100) / 10_000;

        assertEq(token.balanceOf(bob), 0);

        vm.expectEmit(true, true, false, true);
        emit Transfer(address(this), bob, amount - tax);
        token.transfer(bob, amount);

        assertEq(token.balanceOf(bob), amount - tax);
    }

    function testMint() public {
        uint256 amount = 1000;
        token.mint(treasury, amount);

        assertEq(token.balanceOf(treasury), amount);
    }
}
