// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.0;

import "./AggregatorV3Interface.sol";

contract PriceFeed {

    AggregatorV3Interface internal BNBPriceFeed;
    AggregatorV3Interface internal ETHPriceFeed;
    AggregatorV3Interface internal XRPPriceFeed;

    /**
     * Network: Binance Smart Chain Testnet
     */
    constructor() {
        // BNB/USD
        BNBPriceFeed = AggregatorV3Interface(0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526);
        // ETH/USD
        ETHPriceFeed = AggregatorV3Interface(0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7);
        // XRP/USD
        XRPPriceFeed = AggregatorV3Interface(0x4046332373C24Aed1dC8bAd489A04E187833B28d);
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

    /**
     * Returns the latest ETH price
     */
    function getLatestETHPrice() public view returns (int) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = ETHPriceFeed.latestRoundData();
        return price;
    }

    /**
     * Returns the latest XRP price
     */
    function getLatestXRPPrice() public view returns (int) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = XRPPriceFeed.latestRoundData();
        return price;
    }
}