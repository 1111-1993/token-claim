// src/components/ClaimForm.js

import React, { useState, useEffect } from 'react';
import { contract, connectWallet } from '../utils/ethers';

function ClaimForm() {
    const [account, setAccount] = useState('');
    const [remainingTokens, setRemainingTokens] = useState(0);
    const [numUsersClaimed, setNumUsersClaimed] = useState(0);
    const [numTokenHolders, setNumTokenHolders] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const userAccount = await connectWallet();
            setAccount(userAccount);

            const totalSupply = await contract.methods.totalSupply().call();
            const totalFees = await contract.methods.totalFees().call(); // Adjust this based on your token logic
            const remaining = totalSupply - totalFees;
            setRemainingTokens(remaining);

            // Implement functions to get number of users claimed and token holders
            const usersClaimed = await contract.methods.numUsersClaimed().call();
            const holders = await contract.methods.numTokenHolders().call(); // Adjust these based on your contract
            setNumUsersClaimed(usersClaimed);
            setNumTokenHolders(holders);
        }

        fetchData();
    }, []);

    async function claimTokens() {
        // Implement token claim functionality
        // Example: await contract.methods.transfer(account, amount).send({ from: account });
        // Remember to handle transactions and errors
    }

    return (
        <div>
            <h2>Claim Tokens</h2>
            <p>Account: {account}</p>
            <p>Remaining Tokens: {remainingTokens}</p>
            <p>Number of Users Claimed: {numUsersClaimed}</p>
            <p>Number of Token Holders: {numTokenHolders}</p>
            <button onClick={claimTokens}>Claim Tokens</button>
        </div>
    );
}

export default ClaimForm;
