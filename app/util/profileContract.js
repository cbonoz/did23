import { REACH_CONTRACT } from "./metadata";
import { ADMIN_ADDRESS, BLOCKREACH_ADDRESS } from "../constants";
import { ContractFactory, Contract } from "zksync-web3";
import { ethers } from "ethers";


// https://era.zksync.io/docs/reference/concepts/account-abstraction.html#building-custom-accounts
export async function deployContract(signer) {
    const factory = new ContractFactory(
        REACH_CONTRACT.abi,
        REACH_CONTRACT.bytecode,
        signer,
        "create"
    );
    const contract = await factory.deploy();
    // log
    console.log("Deploying contract...");
    await contract.deployed();
    console.log("deployed contract...", contract.address);
    return contract;
}
export const getProfile = async (signer, handle) => {
    const contract = new Contract(
        BLOCKREACH_ADDRESS,
        REACH_CONTRACT.abi,
        signer
    );
    // call with args
    console.log('getting profile for', handle)
    const result = await contract.getProfile(handle);
    return result;
}

export const sendInquiry = async (signer, handle, message, amountEth) => {
    const contract = new Contract(
        BLOCKREACH_ADDRESS,
        REACH_CONTRACT.abi,
        signer
    );
    // call with args
    // Convert value to bignumber wei for zksync
    if (!amountEth) {
        amountEth = 0
    }
    const value = ethers.utils.parseEther(amountEth.toString()).toString();
    console.log('sending inquiry for', handle, value)
    const result = await contract.sendInquiry(handle, message, {
        value
    });
    return result;
}

export const claimProfile = async (signer, handle) => {
    const contract = new Contract(
        BLOCKREACH_ADDRESS,
        REACH_CONTRACT.abi,
        signer
    );
    // call with args
    const result = await contract.claimProfile(handle);
    return result;
}