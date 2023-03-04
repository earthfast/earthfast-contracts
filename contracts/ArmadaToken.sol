// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract ArmadaToken is ERC20Votes, AccessControl, Pausable {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  constructor(
    string memory name,
    string memory symbol,
    address[] memory admins,
    address[] memory minters,
    address[] memory pausers
  ) ERC20(name, symbol) ERC20Permit(name) {
    require(admins.length > 0, "no admins");
    for (uint256 i = 0; i < admins.length; ++i) {
      require(admins[i] != address(0), "zero admin");
      _grantRole(DEFAULT_ADMIN_ROLE, admins[i]);
    }
    for (uint256 i = 0; i < minters.length; ++i) {
      require(minters[i] != address(0), "zero minter");
      _grantRole(MINTER_ROLE, minters[i]);
    }
    for (uint256 i = 0; i < pausers.length; ++i) {
      require(pausers[i] != address(0), "zero pauser");
      _grantRole(PAUSER_ROLE, pausers[i]);
    }
  }

  function pause() public onlyRole(PAUSER_ROLE) { _pause(); }
  function unpause() public onlyRole(PAUSER_ROLE) { _unpause(); }

  function _beforeTokenTransfer(address from, address to, uint256 amount)
  internal override whenNotPaused {
    super._beforeTokenTransfer(from, to, amount);
  }

  function mint(address to, uint256 amount)
  public onlyRole(MINTER_ROLE) {
    _mint(to, amount);
  }

  function burn(uint256 amount) public {
    _burn(msg.sender, amount);
  }

  function burnFrom(address from, uint256 amount) public {
    _spendAllowance(from, msg.sender, amount);
    _burn(from, amount);
  }
}
