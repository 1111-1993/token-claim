const fs = require('fs');
const { ethers } = require('ethers');

async function sendRandomTokens() {
    // Replace the following with your provider URL, such as Infura, Alchemy.
    const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/G2UYE7QBZx0KMBYCuFYxlinanDSQsEFt');
    
    // Replace this with your sender wallet's private key or mnemonic.
    const senderPrivateKey = '8bdf72fefb57232b6a3624a395fe45a9f246baf877be4a2a0446850176d8fa5e';
    
    // Create a wallet for the sender using the private key and connect it to the provider.
    const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
    
    // Read the addresses from the file.
    const addresses = JSON.parse(fs.readFileSync('EVM_addresses.json'));
    
    // Define the token contract address and ABI.
    const tokenContractAddress = '0xD428400908042f2ef721C14150F645B76ffaac1a';
    const tokenContractAbi = [
        // Add the ABI of the token contract here.
        // Minimal ABI needed for token transfers:
        "function transfer(address to, uint256 amount) public returns (bool)"
    ];
    
    // Create a contract instance for the token contract.
    const tokenContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, senderWallet);
    
    // Iterate over the addresses and send a random amount of tokens to each one.
    for (let i = 0; i < addresses.length; i++) {
        const recipientAddress = addresses[i].address;
        const randomAmount = Math.floor(Math.random() * 999) + 1; // Generate a random number between 1 and 999.

        const randomUnits = ethers.utils.parseUnits(randomAmount.toString(), 18);
        
        try {
            // Send the random amount of tokens to the recipient address.
            const tx = await tokenContract.transfer(recipientAddress, randomUnits);
            
            // Wait for the transaction to be confirmed.
            await tx.wait();
            
            console.log(`Sent ${randomAmount} tokens to ${recipientAddress} (Transaction Hash: ${tx.hash})`);
        } catch (err) {
            console.error(`Error sending tokens to ${recipientAddress}:`, err);
        }
    }
}

sendRandomTokens();