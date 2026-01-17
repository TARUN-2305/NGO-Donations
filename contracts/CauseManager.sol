// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CauseManager {
    struct Cause {
        string name;
        uint256 budget;
        uint256 spent;
        bool active;
    }

    uint256 public causeCount;
    mapping(uint256 => Cause) public causes;

    address public admin;

    event CauseCreated(uint256 indexed causeId, string name, uint256 budget);
    event BudgetAdjusted(uint256 indexed causeId, uint256 newBudget);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createCause(
        string calldata _name,
        uint256 _budget
    ) external onlyAdmin {
        require(_budget > 0, "Budget must be > 0");

        causeCount += 1;
        causes[causeCount] = Cause({
            name: _name,
            budget: _budget,
            spent: 0,
            active: true
        });

        emit CauseCreated(causeCount, _name, _budget);
    }

    function adjustBudget(
        uint256 _causeId,
        uint256 _newBudget
    ) external onlyAdmin {
        require(causes[_causeId].active, "Cause inactive");
        require(_newBudget >= causes[_causeId].spent, "Below spent");

        causes[_causeId].budget = _newBudget;
        emit BudgetAdjusted(_causeId, _newBudget);
    }
}