// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

/**
 * @title RealFractionToken
 * @notice Native utility token (ERC-20) for the RealFraction platform.
 * Used for: platform fees, staking, governance (future), reward incentives.
 */
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealFractionToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 * 10**18; // 1B tokens

    constructor() ERC20("RealFraction Token", "RFT") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /// @notice Mint additional tokens (owner only, for rewards/incentives)
    /// @dev Production: add access control, caps, timelock
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @notice Burn tokens (e.g., from platform fee payments)
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
