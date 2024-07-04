// src/utils/ethers.js
import Web3 from 'web3';

import DistributionToken from './DistributionToken.json';
const abi = DistributionToken.abi;


// const tokenContractAbi = [
// //     // Add the ABI of the token contract here.
// //     // Minimal ABI needed for token transfers:
// //     "function transfer(address to, uint256 amount) public returns (bool)"
// ];

const web3 = new Web3(window.ethereum);
const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';
const contract = new web3.eth.Contract(abi, contractAddress);

async function connectWallet() {
    if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        return accounts[0]; // return the user's Ethereum address
    } else {
        alert('Please install MetaMask to use this application!');
    }
}

export { web3, contract, connectWallet };
