// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FreeDistributionToken is ERC20, ERC20Burnable, Ownable(msg.sender) {
    uint256 public constant TOTAL_SUPPLY = 21_000_000_000 * 10 ** 18;
    uint256 public constant TRANSACTION_FEE_PERCENTAGE = 5;

    mapping(address => bool) private _isExcludedFromFees;

    constructor() ERC20("FreeDistributionToken", "FDT") {
        _mint(msg.sender, TOTAL_SUPPLY);
        _isExcludedFromFees[msg.sender] = true;
    }

    function excludeFromFees(
        address account,
        bool excluded
    ) external onlyOwner {
        _isExcludedFromFees[account] = excluded;
    }

    function isExcludedFromFees(address account) public view returns (bool) {
        return _isExcludedFromFees[account];
    }

    function transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal {
        if (!_isExcludedFromFees[sender] && !_isExcludedFromFees[recipient]) {
            uint256 feeAmount = (amount * TRANSACTION_FEE_PERCENTAGE) / 100;
            uint256 amountAfterFee = amount - feeAmount;

            super._transfer(sender, address(this), feeAmount);
            super._transfer(sender, recipient, amountAfterFee);
            distributeFees(feeAmount);
        } else {
            super._transfer(sender, recipient, amount);
        }
    }

    function distributeFees(uint256 feeAmount) private {
        uint256 totalSupplyWithoutContractBalance = totalSupply() -
            balanceOf(address(this));
        if (totalSupplyWithoutContractBalance == 0) return;

        for (uint256 i = 0; i < balanceOf(address(this)); i++) {
            address holder = address(uint160(i));
            if (balanceOf(holder) > 0) {
                uint256 holderShare = (feeAmount * balanceOf(holder)) /
                    totalSupplyWithoutContractBalance;
                _transfer(address(this), holder, holderShare);
            }
        }
    }
}
