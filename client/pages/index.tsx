import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import {
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Layout from "../components/layout/layout";

import { ethers } from "ethers";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import bountiesABI from "../abi/Bounties.abi.json";
import appConfig from "../configs/app";
import { BountiesContext } from "../contexts/bountiesContext";

const Home: NextPage = () => {
  const [balance, setBalance] = useState("");
  const bountiesContext = useContext(BountiesContext);
  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();
  const myContract = new ethers.Contract(
    appConfig.blockchain.contracts.bounties,
    bountiesABI,
    library?.getSigner(account!)
  );

  useEffect(() => {
    library?.getBalance(account!).then((result) => {
      setBalance(ethers.utils.formatEther(result));
    });

    myContract.getAllBounties().then((bounties: SetStateAction<never[]>) => {
      console.log(bounties);
      bountiesContext.setBounties(bounties);
    }); /**/
  });

  return (
    <>
      <Layout>
        <main className={styles.main}>
          {!active ? (
            <h2>No account</h2>
          ) : (
            <div>
              <h2>Welcome, {account}</h2>
              <h3>account balance : {balance}</h3>
            </div>
          )}
        </main>
      </Layout>
    </>
  );
};

export default Home;
