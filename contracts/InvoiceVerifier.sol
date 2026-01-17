// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract InvoiceVerifier {
    enum Decision {
        REJECT,
        REVIEW,
        APPROVE
    }

    struct Invoice {
        string cid;              // IPFS CID (encrypted bundle)
        Decision decision;
        uint256 score;           // credibility score
        bytes32 resultHash;      // hash of ML result JSON
        uint256 timestamp;
    }

    address public admin;
    uint256 public invoiceCount;
    mapping(uint256 => Invoice) public invoices;

    event InvoiceAttested(
        uint256 indexed invoiceId,
        Decision decision,
        uint256 score,
        string cid
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function attestInvoice(
        string calldata _cid,
        Decision _decision,
        uint256 _score,
        bytes32 _resultHash
    ) external onlyAdmin {
        invoiceCount += 1;

        invoices[invoiceCount] = Invoice({
            cid: _cid,
            decision: _decision,
            score: _score,
            resultHash: _resultHash,
            timestamp: block.timestamp
        });

        emit InvoiceAttested(
            invoiceCount,
            _decision,
            _score,
            _cid
        );
    }
}
