// SPDX-License-Identifier: MIT
pragma solidity >= 0.4.0;

contract CryptoInsure {

    struct Policy {
        uint balance; // the insured amount
        uint startDate; // policy start date
        uint waitingPeriodInMonths;
        uint termInMonths; // the length of the insured period
        int bnbPriceAtStart; // peg the price of BNB against USD at start
        int bnbPriceAtClaim;
        uint noOfInstallments; // no of installments over the term
        uint noOfInstallmentsPaid; // no of paid installments
        uint totalInstallmentAmount; // the total repayment amount over the insured period
        bool isInArrears; // true if an installment was missed else false
        bool isClaimApproved; // true if a claim made was approved else false
        bool isWithdrawn;
        uint noOfClaims; // claim > 1 means invalid/declined claims
    }

    address private owner;
    mapping (address => Policy) private policies;

    constructor() {
        owner = msg.sender;
    }

    function registerPolicy(uint amntToInsure, uint termInMonths) public view returns(bool approved) { 
        // make payable
        // receive the BNB and register the policy
    }

    function retrievePolicyDetails() public view returns(bool approved) {
        //
    }

    function retrievePolicyEndDate() public view returns(bool approved) {
    }

    function hasPolicyMatured() public view returns(bool approved) {
    }

    function isClaimApproved() public view returns(bool approved) {
    }

    function makeClaim() public view returns(bool approved) {
    }

    function withdraw() public view returns(bool approved) {
    }

    function changeAddress() public view returns(bool approved) {
    } 
}