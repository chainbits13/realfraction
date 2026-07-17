// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../core/PlatformConfig.sol";
import "./IRentalManager.sol";

/**
 * @title RentalManager
 * @notice Create on-chain rental agreements; tenant pays rent (ETH) per period. Platform fee deducted.
 */
contract RentalManager is IRentalManager, ReentrancyGuard {
    IERC721 public immutable propertyNft;
    PlatformConfig public immutable platformConfig;

    mapping(uint256 => RentalAgreement) public rentalByTokenId;

    constructor(address propertyNft_, address platformConfig_) {
        require(propertyNft_ != address(0) && platformConfig_ != address(0), "RentalManager: zero address");
        propertyNft = IERC721(propertyNft_);
        platformConfig = PlatformConfig(payable(platformConfig_));
    }

    /**
     * @notice Create a rental agreement. Caller must own the property NFT.
     */
    function createRentalAgreement(
        uint256 tokenId,
        address tenant,
        uint256 rentWeiPerPeriod,
        uint256 periodSeconds
    ) external {
        require(propertyNft.ownerOf(tokenId) == msg.sender, "RentalManager: not owner");
        require(tenant != address(0), "RentalManager: zero tenant");
        require(rentWeiPerPeriod > 0 && periodSeconds > 0, "RentalManager: invalid params");
        require(rentalByTokenId[tokenId].landlord == address(0), "RentalManager: rental exists");
        rentalByTokenId[tokenId] = RentalAgreement({
            tokenId: tokenId,
            landlord: msg.sender,
            tenant: tenant,
            rentWeiPerPeriod: rentWeiPerPeriod,
            periodSeconds: periodSeconds,
            startTime: block.timestamp,
            nextPaymentDueTime: block.timestamp + periodSeconds
        });
        emit RentalCreated(tokenId, tenant, rentWeiPerPeriod, periodSeconds);
    }

    /**
     * @notice Tenant pays rent for the current period. Call with msg.value >= rentWeiPerPeriod.
     */
    function payRent(uint256 tokenId) external payable nonReentrant {
        RentalAgreement storage r = rentalByTokenId[tokenId];
        require(r.tenant == msg.sender, "RentalManager: not tenant");
        require(block.timestamp >= r.nextPaymentDueTime, "RentalManager: payment not due");
        require(msg.value >= r.rentWeiPerPeriod, "RentalManager: insufficient payment");

        uint256 fee = (r.rentWeiPerPeriod * platformConfig.platformFeeBps()) / platformConfig.BPS_DENOMINATOR();
        uint256 toLandlord = r.rentWeiPerPeriod - fee;

        r.nextPaymentDueTime += r.periodSeconds;

        (bool sentLandlord,) = payable(r.landlord).call{ value: toLandlord }("");
        require(sentLandlord, "RentalManager: transfer to landlord failed");
        if (fee > 0) {
            (bool sentFee,) = payable(platformConfig.feeRecipient()).call{ value: fee }("");
            require(sentFee, "RentalManager: transfer fee failed");
        }
        if (msg.value > r.rentWeiPerPeriod) {
            (bool sentRefund,) = payable(msg.sender).call{ value: msg.value - r.rentWeiPerPeriod }("");
            require(sentRefund, "RentalManager: refund failed");
        }
        emit RentPaid(tokenId, msg.sender, r.rentWeiPerPeriod, fee);
    }

    function getRental(uint256 tokenId) external view returns (RentalAgreement memory) {
        return rentalByTokenId[tokenId];
    }
}
