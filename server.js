const express = require('express');
const bodyParser = require('body-parser');
const {Web3} = require('web3');
const cors = require('cors'); // Add this line
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Add this line

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL)); // Updated initialization
const contract = '0xcc523a292233c3054eaf32461cb797393a55ac7a';
const ownerAddress = process.env.OWNER_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;

app.post('/claimTokens', async (req, res) => {
    const { recipient, amount } = req.body;

    try {
        const nonce = await web3.eth.getTransactionCount(ownerAddress, 'latest');
        const tx = {
            from: ownerAddress,
            to: process.env.TOKEN_ADDRESS,
            nonce: nonce,
            gas: 2000000,
            data: contract.methods.transfer(recipient, web3.utils.toWei(amount, 'ether')).encodeABI(),
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        res.json({ success: true, receipt });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
