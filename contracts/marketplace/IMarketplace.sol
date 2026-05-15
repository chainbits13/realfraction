// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

interface IMarketplace {
    enum ListingType {
        Sale,
        Rent,
        Auction
    }

    struct Listing {
        uint256 tokenId;
        address lister;
        ListingType listingType;
        uint256 priceWei;
        uint256 rentDurationSeconds;
        uint256 auctionEndTime;
        bool active;
    }

    struct AuctionState {
        uint256 listingIndex;
        address highestBidder;
        uint256 highestBidWei;
        bool settled;
    }

    event Listed(uint256 indexed tokenId, uint256 indexed listingIndex, ListingType listingType, uint256 priceWei, uint256 auctionEndTime);
    event ListingCancelled(uint256 indexed tokenId, uint256 listingIndex);
    event Sold(uint256 indexed tokenId, address indexed buyer, uint256 priceWei, uint256 feeWei);
    event BidPlaced(uint256 indexed tokenId, address indexed bidder, uint256 bidWei);
    event AuctionSettled(uint256 indexed tokenId, address indexed winner, uint256 bidWei, uint256 feeWei);
}
