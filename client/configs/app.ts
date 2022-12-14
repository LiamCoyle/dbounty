export default {
  appName: "DBounty",
  blockchain: {
    supportedChainIds: [
      1, // Ethereum Mainnet
      3, // Ethereum Testnet Ropsten
      4, // Ethereum Testnet Rinkeby
      5, // Ethereum Testnet Goerli
      42, // Ethereum Testnet Kovan
      56, // Binance Smart Chain Mainnet
      97, // Binance Smart Chain Testnet
      137, // Matic(Polygon) Mainnet
      80001, // Matic Testnet Mumbai
      31337, // Hardhat Local
    ],
    contracts: { bounties: "0x5FbDB2315678afecb367f032d93F642f64180aa3" },
  },
};
