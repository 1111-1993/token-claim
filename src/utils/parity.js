import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import abi from './DistributionToken.json'; // Ensure you have the ABI file

/*
const tokenContractAbi = [
  // Add the ABI of the token contract here.
  // Minimal ABI needed for token transfers:
  // "function transfer(address to, uint256 amount) public returns (bool)",
  // "function transfer(address sender, address recipient, uint256 amount) internal",
  // "function isExcludedFromFees(address account) public view returns (bool)",
  // "function excludeFromFees(address account, bool excluded) external onlyOwner",
  // "function distributeFees(uint256 feeAmount) private",
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isExcludedFromFees",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },

];*/

const TOKEN_ADDRESS = '0xcc523a292233c3054eaf32461cb797393a55ac7a';

const ClaimForm = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null); 
  const [remainingTokens, setRemainingTokens] = useState('0');
  const [claimedUsers, setClaimedUsers] = useState(0);
  const [tokenHolders, setTokenHolders] = useState(0);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          const tokenContract = new web3Instance.eth.Contract(abi, TOKEN_ADDRESS);
          setContract(tokenContract);

          const remaining = await tokenContract.methods.balanceOf(TOKEN_ADDRESS).call();
          setRemainingTokens(remaining);

          // Fetch the claimed users and token holders count from your own backend or smart contract logic
          // Here we'll just simulate with dummy data
          setClaimedUsers(10); // replace with actual data
          setTokenHolders(50); // replace with actual data

          const hasClaimed = await tokenContract.methods.isExcludedFromFees(accounts[0]).call();
          setClaimed(hasClaimed);
        } catch (error) {
          console.error("User denied account access or other error:", error);
        }
      } else {
        console.error("Non-Ethereum browser detected. You should consider trying MetaMask!");
      }
    };
    initWeb3();
  }, []);

  const claimTokens = async () => {
    if (!contract || !account) return;
    try {
      await contract.methods.excludeFromFees(account, true).send({ from: account });
      setClaimed(true);
    } catch (error) {
      console.error("Error claiming tokens:", error);
    }
  };

  return (
    <div>
      <h2>Claim Your Tokens</h2>
      {account ? (
        claimed ? (
          <p>You have already claimed your tokens.</p>
        ) : (
          <button onClick={claimTokens}>Claim 500 Tokens</button>
        )
      ) : (
        <p>Please connect your wallet to claim tokens.</p>
      )}
      <div>
        <h3>Real-time Information</h3>
        {web3 ? (
          <>
            <p>Remaining tokens: {web3.utils.fromWei(remainingTokens, 'ether')}</p>
            <p>Number of users who have claimed tokens: {claimedUsers}</p>
            <p>Number of token holders: {tokenHolders}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ClaimForm;
