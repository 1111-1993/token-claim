import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import abi from './DistributionToken.json';

const TOKEN_ADDRESS = '0xcc523a292233c3054eaf32461cb797393a55ac7a';
const OWNER_PRIVATE_KEY = '8bdf72fefb57232b6a3624a395fe45a9f246baf877be4a2a0446850176d8fa5e'; // Replace with owner's private key

const ClaimForm = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null); 
  const [remainingTokens, setRemainingTokens] = useState('0');
  const [totalSupply, setTotalSupply] = useState('0');
  const [ownerTokenBalance, setOwnerTokenBalance] = useState('0');
  const [claimedUsers, setClaimedUsers] = useState(0);
  const [tokenHolders, setTokenHolders] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [claimAmount, setClaimAmount] = useState('500'); // Default claim amount
  const [loading, setLoading] = useState(true);

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

          const totalSupply = await tokenContract.methods.totalSupply().call();
          setTotalSupply(totalSupply);

          const ownerBalance = await tokenContract.methods.balanceOf(accounts[0]).call();
          setOwnerTokenBalance(ownerBalance);

          // Fetch the claimed users and token holders count from your backend or smart contract logic
          // Here we'll just simulate with dummy data
          setClaimedUsers(10); // replace with actual data
          setTokenHolders(50); // replace with actual data

          const hasClaimed = await tokenContract.methods.isExcludedFromFees(accounts[0]).call();
          setClaimed(hasClaimed);

          setLoading(false);
        } catch (error) {
          console.error("User denied account access or other error:", error);
          setLoading(false);
        }
      } else {
        console.error("Non-Ethereum browser detected. You should consider trying MetaMask!");
        setLoading(false);
      }
    };
    initWeb3();
  }, []);

  const handleClaimAmountChange = (event) => {
    setClaimAmount(event.target.value);
  };

  const claimTokens = async () => {
    if (!contract || !account) return;

    try {
      const amount = web3.utils.toWei(claimAmount, 'ether');
      
      // Create a web3 instance with the owner's private key
      const ownerWeb3 = new Web3(new Web3.providers.HttpProvider('https://eth-sepolia.g.alchemy.com/v2/G2UYE7QBZx0KMBYCuFYxlinanDSQsEFt'));
      
      // Create a transaction object for token transfer
      const txObject = {
        from: account,
        to: TOKEN_ADDRESS,
        data: contract.methods.transfer(account, amount).encodeABI()
      };

      // Sign the transaction using the owner's private key
      const signedTx = await ownerWeb3.eth.accounts.signTransaction(txObject, OWNER_PRIVATE_KEY);
      
      // Send the signed transaction
      await ownerWeb3.eth.sendSignedTransaction(signedTx.rawTransaction);
      
      setClaimed(true);
      
      // Update owner's token balance and remaining tokens after transfer
      const ownerBalance = await contract.methods.balanceOf(account).call();
      setOwnerTokenBalance(ownerBalance);
      
      const remaining = await contract.methods.balanceOf(TOKEN_ADDRESS).call();
      setRemainingTokens(remaining);

    } catch (error) {
      console.error("Error claiming tokens:", error);
    }
  };

  return (
    <div>
      <h2>Claim Your Tokens</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
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
                <p>Total token supply: {web3.utils.fromWei(totalSupply, 'ether')}</p>
                <p>Your token balance: {web3.utils.fromWei(ownerTokenBalance, 'ether')}</p>
                <p>Number of users who have claimed tokens: {claimedUsers}</p>
                <p>Number of token holders: {tokenHolders}</p>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ClaimForm;
