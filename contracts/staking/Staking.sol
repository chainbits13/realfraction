// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

/**
 * @title Staking
 * @notice Stake RFT (or platform) tokens; earn rewards. Owner funds reward token; users claim pending rewards.
 */
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Staking is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardToken;

    mapping(address => uint256) public stakedBalance;
    uint256 public totalStaked;
    mapping(address => uint256) public pendingRewards;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsFunded(uint256 amount);
    event RewardsSet(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);

    constructor(address _stakingToken, address _rewardToken) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
    }

    /// @notice Stake tokens
    function stake(uint256 amount) external {
        require(amount > 0, "Staking: zero amount");
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        stakedBalance[msg.sender] += amount;
        totalStaked += amount;
        emit Staked(msg.sender, amount);
    }

    /// @notice Unstake tokens
    function unstake(uint256 amount) external {
        require(amount > 0, "Staking: zero amount");
        require(stakedBalance[msg.sender] >= amount, "Staking: insufficient balance");
        stakedBalance[msg.sender] -= amount;
        totalStaked -= amount;
        stakingToken.safeTransfer(msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }

    /// @notice Owner funds reward token to the contract (for distribution)
    function fundRewards(uint256 amount) external onlyOwner {
        if (amount > 0) {
            rewardToken.safeTransferFrom(msg.sender, address(this), amount);
            emit RewardsFunded(amount);
        }
    }

    /// @notice Owner sets pending rewards for a user (e.g. from off-chain reward logic)
    function setPendingRewards(address user, uint256 amount) external onlyOwner {
        pendingRewards[user] = amount;
        emit RewardsSet(user, amount);
    }

    /// @notice Add to user's pending rewards (batch or algorithmic rewards)
    function addPendingRewards(address user, uint256 amount) external onlyOwner {
        pendingRewards[user] += amount;
        emit RewardsSet(user, pendingRewards[user]);
    }

    /// @notice Claim pending rewards. Sends reward token from contract to caller.
    function claimRewards() external {
        uint256 amount = pendingRewards[msg.sender];
        require(amount > 0, "Staking: nothing to claim");
        pendingRewards[msg.sender] = 0;
        rewardToken.safeTransfer(msg.sender, amount);
        emit RewardsClaimed(msg.sender, amount);
    }

    /// @notice View staked balance for a user
    function balanceOf(address account) external view returns (uint256) {
        return stakedBalance[account];
    }
}
