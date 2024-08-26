// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StreamReward is Ownable {
    IERC20 public token;
    uint256 public creationReward;
    uint256 public viewReward;
    uint256 public engagementReward;
    uint256 public referralReward;

    mapping(address => bool) public hasReferred;

    event RewardIssued(address indexed user, uint256 amount, string rewardType);

    constructor(IERC20 _token) {
        token = _token;
        creationReward = 100 * 10 ** token.decimals();
        viewReward = 10 * 10 ** token.decimals();
        engagementReward = 5 * 10 ** token.decimals();
        referralReward = 50 * 10 ** token.decimals();
    }

    function rewardContentCreation(address _creator) public onlyOwner {
        token.transfer(_creator, creationReward);
        emit RewardIssued(_creator, creationReward, "Content Creation");
    }

    function rewardViewership(address _viewer) public onlyOwner {
        token.transfer(_viewer, viewReward);
        emit RewardIssued(_viewer, viewReward, "Viewership");
    }

    function rewardEngagement(address _user) public onlyOwner {
        token.transfer(_user, engagementReward);
        emit RewardIssued(_user, engagementReward, "Engagement");
    }

    function rewardReferral(address _referrer) public onlyOwner {
        require(!hasReferred[_referrer], "User has already claimed referral reward");
        token.transfer(_referrer, referralReward);
        hasReferred[_referrer] = true;
        emit RewardIssued(_referrer, referralReward, "Referral");
    }

    function updateRewards(
        uint256 _creationReward,
        uint256 _viewReward,
        uint256 _engagementReward,
        uint256 _referralReward
    ) public onlyOwner {
        creationReward = _creationReward;
        viewReward = _viewReward;
        engagementReward = _engagementReward;
        referralReward = _referralReward;
    }
}
