// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC1155Token is ERC1155, Ownable {
   uint256 public constant ROCK = 0;
    uint256 public constant GOLD_COIN = 1;
    uint256 public constant WOOD = 2;
    uint256 public constant BRASS_COIN = 3;
    uint256 public constant BRASS_BOW = 4;
    uint256 public constant SILVER_BOW = 5;
    uint256 public constant GOLD_BOW = 6;

    constructor(string memory url) ERC1155(url) {}

    function mint(address account, uint256 id, uint256 amount, bytes memory data) external onlyOwner {
        _mint(account, id, amount, data);
    }

    function burn(address account, uint256 id, uint256 amount) external onlyOwner {
        _burn(account, id, amount);
    }
}