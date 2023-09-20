// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

import "./ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ForgingContract is Ownable {
    ERC1155Token public token;

    mapping(address => uint256) public lastMintTime;

    constructor(address _tokenAddress) {
        token = ERC1155Token(_tokenAddress);
    }

    function mint(uint256 id) external {
        require(id >= 0 && id <= 2, "Invalid token ID for minting");
        require(
            block.timestamp - lastMintTime[msg.sender] >= 1 minutes,
            "Cooldown in effect"
        );

        lastMintTime[msg.sender] = block.timestamp;
        token.mint(msg.sender, id, 1, "");
    }

    function forge(uint256 id) external {
        if (id == 3) {
            token.burn(msg.sender, 0, 1);
            token.burn(msg.sender, 1, 1);
        } else if (id == 4) {
            token.burn(msg.sender, 1, 1);
            token.burn(msg.sender, 2, 1);
        } else if (id == 5) {
            token.burn(msg.sender, 0, 1);
            token.burn(msg.sender, 2, 1);
        } else if (id == 6) {
            token.burn(msg.sender, 0, 1);
            token.burn(msg.sender, 1, 1);
            token.burn(msg.sender, 2, 1);
        } else {
            revert("Invalid forge ID");
        }

        token.mint(msg.sender, id, 1, "");
    }

    function trade(uint id, uint trade_token_id) external {
        require(
            trade_token_id >= 0 && trade_token_id <= 6,
            "Invalid trade_token_id"
        );

        token.burn(msg.sender, id, 1);
        token.mint(msg.sender, trade_token_id, 1, "");
    }

    function burn(uint256 id) external {
        require(id >= 0 && id <= 6, "Invalid token ID for burning");
        token.burn(msg.sender, id, 1);
    }

    function resetCooldown() external onlyOwner {
        lastMintTime[msg.sender] = block.timestamp - 61;
    }
}
