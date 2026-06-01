// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

interface IRentalManager {
    struct RentalAgreement {
        uint256 tokenId;
        address landlord;
        address tenant;
        uint256 rentWeiPerPeriod;
        uint256 periodSeconds;
        uint256 startTime;
        uint256 nextPaymentDueTime;
    }

    event RentalCreated(uint256 indexed tokenId, address indexed tenant, uint256 rentWeiPerPeriod, uint256 periodSeconds);
    event RentPaid(uint256 indexed tokenId, address indexed tenant, uint256 amountWei, uint256 feeWei);
}
