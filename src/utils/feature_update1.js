import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import abi from './DistributionToken.json';

const TOKEN_ADDRESS = '0xcc523a292233c3054eaf32461cb797393a55ac7a';

const ClaimForm = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [remainingTokens, setRemainingTokens] = useState('0');
  const [claimedUsers, setClaimedUsers] = useState(0);
  const [tokenHolders, setTokenHolders] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [claimAmount, setClaimAmount] = useState('500'); // Default claim amount

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

  const handleClaimAmountChange = (event) => {
    setClaimAmount(event.target.value);
  };

  const claimTokens = async () => {
    if (!account) return;
    try {
      const response = await fetch('http://localhost:3000/claimTokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: account,
          amount: claimAmount,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setClaimed(true);
      } else {
        console.error("Error claiming tokens:", data.error);
      }
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
          <div>
            <input type="number" value={claimAmount} onChange={handleClaimAmountChange} />
            <button onClick={claimTokens}>Claim Tokens</button>
          </div>
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
