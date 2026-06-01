// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title PropertyNft
 * @notice ERC-721 property ownership NFT. Digital proof of ownership, transferable certificate,
 * programmable access key for smart homes. Used by Marketplace and RentalManager.
 */
contract PropertyNft is ERC721URIStorage, ERC721Enumerable, Ownable(msg.sender), AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(address to, string memory _tokenURI) external onlyRole(MINTER_ROLE) returns (uint256 newTokenId) {
        newTokenId = totalSupply();
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable, ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage, ERC721) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
}
