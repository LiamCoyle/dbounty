import { zeroPad } from "ethers/lib/utils";
import { ethers } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();
  console.log(`Deployer account : ${signers[0].address}`);
  const Bounties = await ethers.getContractFactory("Bounties");

  const bounties = await Bounties.deploy();

  await bounties.deployed();

  console.log(`Bounties deployed at : ${bounties.address}`);

  await bounties.create("title test", "desc test", 1000000, false, true, {
    from: signers[0].address,
    value: ethers.utils.parseEther("10"),
  });
  const activeBounty = await bounties.getActiveBounties({
    from: signers[0].address,
  }); /**/
  const bounty = await bounties.getAllBounties({ from: signers[0].address });
  console.log(`Number of total Bounties : ${bounty.length}`);
  console.log(`Number of active Bounties : ${activeBounty.length}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
