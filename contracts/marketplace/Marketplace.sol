// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../core/PlatformConfig.sol";
import "./IMarketplace.sol";

/**
 * @title Marketplace
 * @notice List properties for sale, rent, or auction; buy; place bid; settle auction.
 * Payments in native ETH. Platform fee taken on sale and auction settlement.
 */
contract Marketplace is IMarketplace, ReentrancyGuard {
    IERC721 public immutable propertyNft;
    PlatformConfig public immutable platformConfig;

    Listing[] public listings;
    mapping(uint256 => uint256) public listingIndexByTokenId; // tokenId => latest listing index (1-based; 0 = none)

    mapping(uint256 => AuctionState) public auctionByListingIndex; // listingIndex => auction state

    constructor(address propertyNft_, address platformConfig_) {
        require(propertyNft_ != address(0) && platformConfig_ != address(0), "Marketplace: zero address");
        propertyNft = IERC721(propertyNft_);
        platformConfig = PlatformConfig(payable(platformConfig_));
    }

    /**
     * @notice List a property for sale, rent, or auction.
     * For auction, auctionEndTime must be in the future.
     */
    function list(
        uint256 tokenId,
        ListingType listingType,
        uint256 priceWei,
        uint256 rentDurationSeconds,
        uint256 auctionEndTime
    ) external nonReentrant {
        require(propertyNft.ownerOf(tokenId) == msg.sender, "Marketplace: not owner");
        require(priceWei > 0, "Marketplace: zero price");
        if (listingType == ListingType.Auction) {
            require(auctionEndTime > block.timestamp, "Marketplace: auction end in past");
        }
        uint256 idx = listings.length;
        listings.push(Listing({
            tokenId: tokenId,
            lister: msg.sender,
            listingType: listingType,
            priceWei: priceWei,
            rentDurationSeconds: rentDurationSeconds,
            auctionEndTime: auctionEndTime,
            active: true
        }));
        listingIndexByTokenId[tokenId] = idx + 1;
        if (listingType == ListingType.Auction) {
            auctionByListingIndex[idx] = AuctionState({ listingIndex: idx, highestBidder: address(0), highestBidWei: 0, settled: false });
        }
        emit Listed(tokenId, idx, listingType, priceWei, auctionEndTime);
    }

    function cancelListing(uint256 listingIndex) external {
        require(listingIndex < listings.length, "Marketplace: invalid index");
        Listing storage l = listings[listingIndex];
        require(l.lister == msg.sender && l.active, "Marketplace: not lister or inactive");
        l.active = false;
        emit ListingCancelled(l.tokenId, listingIndex);
    }

    /**
     * @notice Buy a listing (sale only). Call with msg.value >= listing.priceWei.
     */
    function buyListing(uint256 listingIndex) external payable nonReentrant {
        require(listingIndex < listings.length, "Marketplace: invalid index");
        Listing storage l = listings[listingIndex];
        require(l.active && l.listingType == ListingType.Sale, "Marketplace: not active sale");
        require(msg.value >= l.priceWei, "Marketplace: insufficient payment");

        uint256 fee = (l.priceWei * platformConfig.platformFeeBps()) / platformConfig.BPS_DENOMINATOR();
        uint256 toSeller = l.priceWei - fee;

        l.active = false;
        if (listingIndexByTokenId[l.tokenId] == listingIndex + 1) {
            listingIndexByTokenId[l.tokenId] = 0;
        }

        propertyNft.transferFrom(l.lister, msg.sender, l.tokenId);

        (bool sentSeller,) = payable(l.lister).call{ value: toSeller }("");
        require(sentSeller, "Marketplace: transfer to seller failed");
        if (fee > 0) {
            (bool sentFee,) = payable(platformConfig.feeRecipient()).call{ value: fee }("");
            require(sentFee, "Marketplace: transfer fee failed");
        }
        if (msg.value > l.priceWei) {
            (bool sentRefund,) = payable(msg.sender).call{ value: msg.value - l.priceWei }("");
            require(sentRefund, "Marketplace: refund failed");
        }

        emit Sold(l.tokenId, msg.sender, l.priceWei, fee);
    }

    /**
     * @notice Place or raise bid. Replaces previous bid; previous bidder refunded.
     */
    function placeBid(uint256 listingIndex) external payable nonReentrant {
        require(listingIndex < listings.length, "Marketplace: invalid index");
        Listing storage l = listings[listingIndex];
        require(l.active && l.listingType == ListingType.Auction && l.auctionEndTime > block.timestamp, "Marketplace: not active auction");
        uint256 minBid = auctionByListingIndex[listingIndex].highestBidWei + 1;
        require(msg.value >= minBid, "Marketplace: bid too low");

        AuctionState storage a = auctionByListingIndex[listingIndex];
        if (a.highestBidder != address(0)) {
            (bool sent,) = payable(a.highestBidder).call{ value: a.highestBidWei }("");
            require(sent, "Marketplace: refund bid failed");
        }
        a.highestBidder = msg.sender;
        a.highestBidWei = msg.value;
        emit BidPlaced(l.tokenId, msg.sender, msg.value);
    }

    /**
     * @notice Settle auction after auctionEndTime. Winner must call or anyone can settle.
     */
    function settleAuction(uint256 listingIndex) external nonReentrant {
        require(listingIndex < listings.length, "Marketplace: invalid index");
        Listing storage l = listings[listingIndex];
        require(l.listingType == ListingType.Auction && block.timestamp >= l.auctionEndTime, "Marketplace: auction not ended");
        AuctionState storage a = auctionByListingIndex[listingIndex];
        require(!a.settled && a.highestBidder != address(0), "Marketplace: already settled or no bid");

        a.settled = true;
        l.active = false;
        if (listingIndexByTokenId[l.tokenId] == listingIndex + 1) {
            listingIndexByTokenId[l.tokenId] = 0;
        }

        uint256 fee = (a.highestBidWei * platformConfig.platformFeeBps()) / platformConfig.BPS_DENOMINATOR();
        uint256 toSeller = a.highestBidWei - fee;

        propertyNft.transferFrom(l.lister, a.highestBidder, l.tokenId);
        (bool sentSeller,) = payable(l.lister).call{ value: toSeller }("");
        require(sentSeller, "Marketplace: transfer to seller failed");
        if (fee > 0) {
            (bool sentFee,) = payable(platformConfig.feeRecipient()).call{ value: fee }("");
            require(sentFee, "Marketplace: transfer fee failed");
        }
        emit AuctionSettled(l.tokenId, a.highestBidder, a.highestBidWei, fee);
    }

    function getListing(uint256 listingIndex) external view returns (Listing memory) {
        return listings[listingIndex];
    }

    function getAuction(uint256 listingIndex) external view returns (AuctionState memory) {
        return auctionByListingIndex[listingIndex];
    }

    function listingsLength() external view returns (uint256) {
        return listings.length;
    }
}
