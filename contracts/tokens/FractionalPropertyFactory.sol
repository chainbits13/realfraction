// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "./FractionalPropertyToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FractionalPropertyFactory
 * @notice Deploys FractionalPropertyToken per property and mints initial supply to caller.
 */
contract FractionalPropertyFactory is Ownable {
    mapping(uint256 => address) public fractionalTokenByProperty; // propertyTokenId => token address

    event FractionalTokenCreated(uint256 indexed propertyTokenId, address indexed token, address indexed owner, uint256 supply);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Create fractional ERC-20 for a property and mint supply to msg.sender.
     * @param propertyTokenId NFT token ID of the property.
     * @param name Token name (e.g. "Property 42 Fractions").
     * @param symbol Token symbol (e.g. "P42").
     * @param totalSupply Initial supply to mint to msg.sender.
     */
    function createFractionalToken(
        uint256 propertyTokenId,
        string calldata name,
        string calldata symbol,
        uint256 totalSupply
    ) external returns (address token) {
        require(fractionalTokenByProperty[propertyTokenId] == address(0), "FractionalPropertyFactory: token exists");
        require(totalSupply > 0, "FractionalPropertyFactory: zero supply");

        FractionalPropertyToken t = new FractionalPropertyToken(
            name,
            symbol,
            propertyTokenId,
            address(this),
            msg.sender
        );
        token = address(t);
        fractionalTokenByProperty[propertyTokenId] = token;
        FractionalPropertyToken(token).mint(msg.sender, totalSupply);
        emit FractionalTokenCreated(propertyTokenId, token, msg.sender, totalSupply);
    }
}
