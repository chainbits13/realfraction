// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PlatformConfig
 * @notice Global platform configuration: authority, platform fee (basis points), fee recipient.
 * Used by Marketplace, RentalManager, and other protocol components.
 */
contract PlatformConfig is Ownable {
    uint16 public platformFeeBps;
    address public feeRecipient;

    uint16 public constant BPS_DENOMINATOR = 10_000;

    event FeeUpdated(uint16 oldBps, uint16 newBps);
    event FeeRecipientUpdated(address indexed oldRecipient, address indexed newRecipient);

    constructor(address owner_, uint16 platformFeeBps_, address feeRecipient_) Ownable(owner_) {
        require(platformFeeBps_ <= BPS_DENOMINATOR, "PlatformConfig: fee exceeds 100%");
        require(feeRecipient_ != address(0), "PlatformConfig: zero fee recipient");
        platformFeeBps = platformFeeBps_;
        feeRecipient = feeRecipient_;
    }

    function setPlatformFeeBps(uint16 bps) external onlyOwner {
        require(bps <= BPS_DENOMINATOR, "PlatformConfig: fee exceeds 100%");
        uint16 old = platformFeeBps;
        platformFeeBps = bps;
        emit FeeUpdated(old, bps);
    }

    function setFeeRecipient(address recipient) external onlyOwner {
        require(recipient != address(0), "PlatformConfig: zero address");
        address old = feeRecipient;
        feeRecipient = recipient;
        emit FeeRecipientUpdated(old, recipient);
    }
}
