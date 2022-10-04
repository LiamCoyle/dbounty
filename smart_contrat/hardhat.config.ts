import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",

  /*networks: {
    prater: {
      url: process.env.ENDPOINT_PRATER,
      accounts: [process.env.INFURA_API_KEY ?? ""],
    },
  },*/
};

export default config;
