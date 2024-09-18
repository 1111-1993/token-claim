
# Token Distribution and Fee Mechanism

## Deployment

To run the project follow the following steps:

### 1. Deploy the smart contract
You can use any EVM deployment tool like `Hardhat` or `Remix IDE`. Get the contract address.

After compilation of Smart contract you'll get `ABI` to update the file `scr/utils/DistributionToken.json`  

### 2. Configure `src/utils/config.js` file
update the following addresses:

`TOKEN_ADDRESS` = '0x00.....'

`OWNER_ADDRESS` = '0x00.....'

`OWNER_PRIVATE_KEY` = '0x00......'

### 3. 
First run
```bash
  npm install
```
then
```bash
  npm start
```

