import { useWeb3React } from "@web3-react/core";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";

import { ethers } from "ethers";
import bountiesABI from "../../abi/Bounties.abi.json";
import appConfig from "../../configs/app";
import { BountiesContext } from "../../contexts/bountiesContext";
export default function Bounties() {
  const bountiesContext = useContext(BountiesContext);
  const [bounties, setBounties] = useState([]);
  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();
  const myContract = new ethers.Contract(
    appConfig.blockchain.contracts.bounties,
    bountiesABI,
    library?.getSigner()
  );

  useEffect(() => {
    myContract.getAllBounties().then((bounties: SetStateAction<never[]>) => {
      console.log(bounties);
      bountiesContext.setBounties(bounties);
    });
  });
  return <h1>Bounties</h1>;
}
