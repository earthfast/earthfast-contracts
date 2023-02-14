// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

/// @title A fake USDC used on networks that have no real USDC (e.g. localhost).
contract USDC is ERC20Permit {
  constructor(address owner) ERC20("USDC Coin", "USDC") ERC20Permit("USDC Coin") {
    _mint(owner, 1_000_000_000 * 10**decimals());
  }

  function version() external pure returns (string memory) {
    return "1";
  }
}
