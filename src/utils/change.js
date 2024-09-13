import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import BN from 'bn.js';
import abi from './DistributionToken.json';
import {TOKEN_ADDRESS, OWNER_ADDRESS, OWNER_PRIVATE_KEY} from './config'


const MAX_CLAIMABLE_AMOUNT = new BN(Web3.utils.toWei('5000', 'ether')); // Maximum claimable amount in Wei

const ClaimForm = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [totalSupply, setTotalSupply] = useState('0');
  const [ownerTokenBalance, setOwnerTokenBalance] = useState('0');
  const [claimAmount, setClaimAmount] = useState('0');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]); // State for transactions
  const [claimedUsers, setClaimedUsers] = useState(new Set()); // State for tracking claimed users
  const [userClaimedAmount, setUserClaimedAmount] = useState('0'); // State for tracking user's total claimed amount
  const [claimMessage, setClaimMessage] = useState(''); // State for displaying claim message

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          // Add the owner private key and set the default account
          const senderAccount = web3Instance.eth.accounts.privateKeyToAccount(OWNER_PRIVATE_KEY);
          web3Instance.eth.accounts.wallet.add(senderAccount);
          web3Instance.eth.defaultAccount = senderAccount.address;

          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          const tokenContract = new web3Instance.eth.Contract(abi, TOKEN_ADDRESS);
          setContract(tokenContract);

          const totalSupply = await tokenContract.methods.totalSupply().call();
          setTotalSupply(totalSupply);

          const ownerBalance = await tokenContract.methods.balanceOf(OWNER_ADDRESS).call();
          setOwnerTokenBalance(ownerBalance);

          // Fetch user's total claimed amount from your backend or smart contract
          // Here we'll just simulate with dummy data
          const claimedAmount = '0'; // replace with actual data
          setUserClaimedAmount(claimedAmount);

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

    const amountWei = new BN(Web3.utils.toWei(claimAmount.toString(), 'ether'));
    const currentClaimedAmountWei = new BN(Web3.utils.toWei(userClaimedAmount.toString(), 'ether'));
    const newClaimedAmountWei = currentClaimedAmountWei.add(amountWei);

    if (newClaimedAmountWei.gt(MAX_CLAIMABLE_AMOUNT)) {
      alert(`You can only claim up to a total of 5000 tokens.`);
      return;
    }

    try {
      // Perform the transfer from owner to the user's account
      await contract.methods.transfer(account, amountWei.toString()).send({ from: OWNER_ADDRESS, gas: 200000 });

      // Update owner's token balance after transfer
      const ownerBalance = await contract.methods.balanceOf(OWNER_ADDRESS).call();
      setOwnerTokenBalance(ownerBalance);

      // Add the new transaction to the transactions state
      setTransactions([...transactions, { id: transactions.length + 1, address: account, amount: claimAmount }]);

      // Add user to claimed users set
      setClaimedUsers(prevClaimedUsers => new Set(prevClaimedUsers).add(account));

      // Update user's total claimed amount
      setUserClaimedAmount(Web3.utils.fromWei(newClaimedAmountWei, 'ether'));

      // Set claim message
      setClaimMessage(`Successfully claimed ${claimAmount} tokens.`);
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
            <div>
              <input type="number" value={claimAmount} onChange={handleClaimAmountChange} />
              <button onClick={claimTokens}>Claim Tokens</button>
            </div>
          ) : (
            <p>Please connect your wallet to claim tokens.</p>
          )}
          <div>
            <h3>Real-time Information</h3>
            {web3 ? (
              <>
                <p>Total FGT Token Supply: {Web3.utils.fromWei(totalSupply, 'ether')}</p>
                <p>Your token balance: {Web3.utils.fromWei(ownerTokenBalance, 'ether')}</p>
                <p>Number of users who have claimed tokens: {claimedUsers.size}</p>
                <p>Your total claimed amount: {userClaimedAmount}</p>
                {claimMessage && <p>{claimMessage}</p>}
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div>
            <h3>Recent Transactions</h3>
            {transactions.length > 0 ? (
              <ul>
                {transactions.map(tx => (
                  <li key={tx.id}>
                    Address: {tx.address} - Amount: {tx.amount}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No transactions yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ClaimForm;
