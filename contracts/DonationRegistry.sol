// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DonationRegistry {
    /*//////////////////////////////////////////////////////////////
                                TYPES
    //////////////////////////////////////////////////////////////*/

    struct Donation {
        bytes32 donorCommitment;   // hash of (identity + salt)
        uint256 causeId;
        uint256 amount;
        uint256 timestamp;
        string receiptCID;          // IPFS CID (encrypted bundle)
    }

    /*//////////////////////////////////////////////////////////////
                              STORAGE
    //////////////////////////////////////////////////////////////*/

    uint256 public donationCount;

    // donationId => Donation
    mapping(uint256 => Donation) public donations;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event DonationReceived(
        uint256 indexed donationId,
        uint256 indexed causeId,
        uint256 amount,
        bytes32 donorCommitment
    );

    event ReceiptAnchored(
        uint256 indexed donationId,
        string receiptCID
    );

    /*//////////////////////////////////////////////////////////////
                              EXTERNAL API
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Record a donation and anchor its receipt CID
     * @param _donorCommitment Hash of donor identity + salt
     * @param _causeId Target cause identifier
     * @param _receiptCID IPFS CID of encrypted receipt bundle
     */
    function recordDonation(
        bytes32 _donorCommitment,
        uint256 _causeId,
        string calldata _receiptCID
    ) external payable {
        require(msg.value > 0, "Donation amount must be > 0");
        require(bytes(_receiptCID).length > 0, "Receipt CID required");

        donationCount += 1;

        donations[donationCount] = Donation({
            donorCommitment: _donorCommitment,
            causeId: _causeId,
            amount: msg.value,
            timestamp: block.timestamp,
            receiptCID: _receiptCID
        });

        emit DonationReceived(
            donationCount,
            _causeId,
            msg.value,
            _donorCommitment
        );

        emit ReceiptAnchored(donationCount, _receiptCID);
    }

    /*//////////////////////////////////////////////////////////////
                              VIEW HELPERS
    //////////////////////////////////////////////////////////////*/

    function getDonation(uint256 _donationId)
        external
        view
        returns (
            bytes32 donorCommitment,
            uint256 causeId,
            uint256 amount,
            uint256 timestamp,
            string memory receiptCID
        )
    {
        Donation memory d = donations[_donationId];
        return (
            d.donorCommitment,
            d.causeId,
            d.amount,
            d.timestamp,
            d.receiptCID
        );
    }
}