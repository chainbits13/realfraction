// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FractionalPropertyToken
 * @notice ERC-20 fractional ownership tokens for a single property.
 * One deployment per property; created by FractionalPropertyFactory.
 * Owner (factory or property owner) receives initial supply.
 */
contract FractionalPropertyToken is ERC20, Ownable {
    uint256 public immutable propertyTokenId;
    address public immutable factory;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 propertyTokenId_,
        address factory_,
        address initialOwner_
    ) ERC20(name_, symbol_) Ownable(initialOwner_) {
        propertyTokenId = propertyTokenId_;
        factory = factory_;
    }

    /**
     * @notice Mint initial supply to owner (callable by factory or owner once).
     * @dev Factory calls this right after deployment to mint to property owner.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
