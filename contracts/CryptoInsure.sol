// SPDX-License-Identifier: MIT
pragma solidity >= 0.4.0;

import "./AggregatorV3Interface.sol";

contract CryptoInsure {

    struct PricingPlan {
        uint percentageMarkup;
        uint noOfPayments; // no of installments over the term
        uint waitingPeriodInMonths;
    }

    struct Policy {
        bool exists; // used internally to check for existence in mapping
        bool pendingFirstInstallment;
        uint balance; // the insured amount
        uint startDate; // policy start date
        uint termInMonths; // the length of the insured period
        int bnbPriceAtStart; // peg the price of BNB against USD at start
        int bnbPriceAtClaim;
        uint noOfInstallmentsPaid; // no of paid installments
        uint totalRepayment; // the total repayment amount over the insured period
        bool isBalanceToppedUp; // true if a claim made was approved else false
        bool isWithdrawn;
        uint noOfClaims; // claim > 1 means invalid/declined claims
        PricingPlan pricingPlan;
    }

    address private owner;
    mapping (address => Policy) private policies;
    mapping (uint => PricingPlan) pricingPlans;
    AggregatorV3Interface internal BNBPriceFeed;

    constructor() { 
        owner = msg.sender;
        pricingPlans[6].percentageMarkup = 140;
        pricingPlans[6].noOfPayments = 1;
        pricingPlans[6].waitingPeriodInMonths = 2;
        pricingPlans[12].percentageMarkup = 120;
        pricingPlans[12].noOfPayments = 2;
        pricingPlans[12].waitingPeriodInMonths = 3;
         // BNB/USD
        BNBPriceFeed = AggregatorV3Interface(0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526);
    }

    modifier isOwner() {
        require(msg.sender == owner);
        _; // continue executing rest of method body
    }

    modifier isPolicyActive(address clientAddress) {
        Policy memory policy = policies[clientAddress];
        require(policy.exists && block.timestamp < calculateInstallmentDate(policy) && block.timestamp < retrievePolicyEndDate(policy));
        _;
    }

    /**
     * Returns the latest BNB price
     */
    function getLatestBNBPrice() public view returns (int) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = BNBPriceFeed.latestRoundData();
        return price;
    }

    function retrievePolicyEndDate(Policy memory policy) private pure returns(uint endDate) {
        return policy.startDate + (policy.termInMonths * 30 days);
    }

    function retrieveInstallmentAmount(Policy memory policy) private pure returns(uint installmentAmount) {
        return policy.totalRepayment / policy.pricingPlan.noOfPayments;
    }   

    function calculateInstallmentDate(Policy memory policy) private view returns(uint nextInstallmentDate) {
        if (policy.pendingFirstInstallment) {
            return block.timestamp;
        } 
        uint remainingPayments = policy.pricingPlan.noOfPayments - policy.noOfInstallmentsPaid;
        if (remainingPayments == 0) {
            return 0;
        }
        return policy.startDate + ((policy.termInMonths / 2) * 30 days); // todo: work out days in month
    } 

    function registerPolicy(uint amntToInsure, uint termInMonths) public payable returns(bool registered) { 
        if (msg.value < 100000000 || policies[msg.sender].exists) { // 1 BNB is the minimum insured amount
            revert();
        } 
        Policy memory policy;
        policy.exists = true;
        policy.startDate = block.timestamp;
        policy.pricingPlan = pricingPlans[termInMonths];
        policy.pendingFirstInstallment = true;
        policy.totalRepayment = (msg.value * pricingPlans[termInMonths].percentageMarkup) / 100;
        policy.bnbPriceAtStart = getLatestBNBPrice();
        policies[msg.sender] = policy;
    }

    function retrievePolicyDetails(address clientAddress) public view returns(uint balance, uint totalRepayment, uint noOfInstallments, 
                                                                              uint installmentAmount, uint waitingPeriod, bool isInArrears, 
                                                                              uint startDate, uint endDate, bool pendingFirstInstallment,
                                                                              bool isBalanceToppedUp) {
        require(policies[clientAddress].exists);
        Policy memory policy = policies[clientAddress];
        bool isInArrears = block.timestamp >= calculateInstallmentDate(policy);
        return (policy.balance, policy.totalRepayment, policy.pricingPlan.noOfPayments, 
                retrieveInstallmentAmount(policy), policy.pricingPlan.waitingPeriodInMonths, 
                isInArrears, policy.startDate, retrievePolicyEndDate(policy), 
                policy.pendingFirstInstallment, policy.isBalanceToppedUp);
    }

    function hasPolicyMatured(address clientAddress) public view returns(bool) {
        require(policies[clientAddress].exists);
        return block.timestamp >= retrievePolicyEndDate(policies[clientAddress]);
    }

    function makeClaim() public isPolicyActive(msg.sender) returns(bool) {
        require(!policies[msg.sender].isBalanceToppedUp);
        Policy memory policy = policies[msg.sender];
        policy.bnbPriceAtClaim = getLatestBNBPrice();
        int claimThreshold =  10000 - ((policy.bnbPriceAtClaim * 10000) / policy.bnbPriceAtStart);
        if (claimThreshold < 4001) {
            return false;
        }
        policy.isBalanceToppedUp = true;
        //top up balance
        policy.balance += ((policy.balance * uint(policy.bnbPriceAtStart * claimThreshold)) / 1000) / uint(policy.bnbPriceAtClaim);
        return true;
    }

    function withdraw() public returns(bool) {
        require(policies[msg.sender].exists && !policies[msg.sender].isWithdrawn && address(this).balance >= policies[msg.sender].balance);
        policies[msg.sender].isWithdrawn = true;
        address payable wallet = payable(msg.sender);
        wallet.transfer(policies[msg.sender].balance);
        return true;
    }

    function changeAddress(address newAddress) public returns(bool) {
        require(policies[msg.sender].exists);
        Policy memory policy = policies[msg.sender]; // need to still test
        delete(policies[msg.sender]);
        policies[newAddress] = policy;
        return true;
    } 

    function payInstallment(address clientAddress) public payable returns(bool) {
        Policy memory policy = policies[clientAddress];
        if (!policy.exists || msg.value < retrieveInstallmentAmount(policy)) {
            revert();
        }
        policy.noOfInstallmentsPaid += 1;
        policy.pendingFirstInstallment = false;
        return true;
    } 

    // assuming a maximum of 2 installments over 12 month period for now
    function getNextInstallmentDate(address clientAddress) public view returns(uint) {
        require(policies[clientAddress].exists);
        Policy memory policy = policies[clientAddress];
        return calculateInstallmentDate(policy);
    } 

    function cancelPolicy() public returns(bool cancelled) {
        require(policies[msg.sender].exists);
        policies[msg.sender].termInMonths = 0;
        policies[msg.sender].exists = false;
        return true;
    }   

    function ownerCancelPolicy(address clientAddress) public isOwner() returns(bool cancelled) {
        require(policies[clientAddress].exists);
        policies[msg.sender].termInMonths = 0; // find a way to reset policy
        policies[msg.sender].exists = false;
        return true;
    }   
}