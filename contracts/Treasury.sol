// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Treasury {
    address public admin;
    uint256 public constant TIMELOCK = 1 minutes;

    struct Payout {
        address payable vendor;
        uint256 amount;
        uint256 executeAfter;
        bool executed;
    }

    uint256 public payoutCount;
    mapping(uint256 => Payout) public payouts;

    event PayoutQueued(
        uint256 indexed payoutId,
        address vendor,
        uint256 amount,
        uint256 executeAfter
    );

    event PayoutExecuted(
        uint256 indexed payoutId,
        address vendor,
        uint256 amount
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    receive() external payable {}

    function queuePayout(
        address payable _vendor,
        uint256 _amount
    ) external onlyAdmin {
        require(address(this).balance >= _amount, "Insufficient funds");

        payoutCount += 1;

        payouts[payoutCount] = Payout({
            vendor: _vendor,
            amount: _amount,
            executeAfter: block.timestamp + TIMELOCK,
            executed: false
        });

        emit PayoutQueued(
            payoutCount,
            _vendor,
            _amount,
            block.timestamp + TIMELOCK
        );
    }

    function executePayout(uint256 _payoutId) external onlyAdmin {
        Payout storage p = payouts[_payoutId];

        require(!p.executed, "Already executed");
        require(block.timestamp >= p.executeAfter, "Timelock active");

        p.executed = true;
        p.vendor.transfer(p.amount);

        emit PayoutExecuted(_payoutId, p.vendor, p.amount);
    }
}