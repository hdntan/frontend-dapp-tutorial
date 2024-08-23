# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Setting Up a React Project with useDapp
Create a React App:

bash
Sao chép mã
npx create-react-app frontend
cd frontend
Install Dependencies:

bash
Sao chép mã
npm install ethers@5.6.9 @usedapp/core @mui/material @mui/system @emotion/react @emotion/styled
Ethers.js: For JSON-RPC communication.
useDapp: Provides React hooks for Ethers.js.
MUI: For UI components and styling.
Configure App.js:
Update frontend/src/App.js to include basic structure:

jsx
Sao chép mã
import { useEthers } from '@usedapp/core';
import { Button, Grid, Card } from '@mui/material';
import { Box } from '@mui/system';

const styles = {
  box: { minHeight: '100vh', backgroundColor: '#1b3864' },
  vh100: { minHeight: '100vh' },
  card: { borderRadius: 4, padding: 4, maxWidth: '550px', width: '100%' },
  alignCenter: { textAlign: 'center' },
};

function App() {
  return (
    <Box sx={styles.box}>
      <Grid
        container
        direction='column'
        alignItems='center'
        justifyContent='center'
        style={styles.vh100}
      >
        {/* Functional components will go here */}
      </Grid>
    </Box>
  );
}

export default App;
Start React Project:

bash
Sao chép mã
npm run start
The frontend will be available at localhost:3000.
Set Up Providers and Wallets:

Providers: Connects frontend to blockchain, handling JSON-RPC communication.
Signers: Sign transactions; Wallets (like MetaMask) manage private keys and facilitate signing.
Configure DAppProvider:
Update frontend/src/index.js:

jsx
Sao chép mã
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DAppProvider, MoonbaseAlpha } from '@usedapp/core';
import { getDefaultProvider } from 'ethers';

const config = {
  readOnlyChainId: MoonbaseAlpha.chainId,
  readOnlyUrls: {
    [MoonbaseAlpha.chainId]: getDefaultProvider(
      'https://rpc.api.moonbase.moonbeam.network'
    ),
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>
);
Add Wallet Connection Button:
Update App.js to include wallet connection functionality:

jsx
Sao chép mã
function App() {
  const { activateBrowserWallet, deactivate, account } = useEthers();

  const handleWalletConnection = () => {
    if (account) deactivate();
    else activateBrowserWallet();
  };

  return (
    <Box sx={styles.box}>
      <Grid
        container
        direction='column'
        alignItems='center'
        justifyContent='center'
        style={styles.vh100}
      >
        <Box position='absolute' top={8} right={16}>
          <Button variant='contained' onClick={handleWalletConnection}>
            {account
              ? `Disconnect ${account.substring(0, 5)}...`
              : 'Connect Wallet'}
          </Button>
        </Box>
      </Grid>
    </Box>
  );
}

Reading Data from Smart Contracts
To display information such as the maximum amount of tokens that can be minted and the number of tokens already minted, follow these steps:

Move ABI File:

Copy MintableERC20.json from your Hardhat project to frontend/src.
css
Sao chép mã
|--frontend
    |--src
        |--MintableERC20.json
Create Smart Contract Instance:

Update App.js to import the ABI and create a contract instance:
jsx
Sao chép mã
import MintableERC20 from './MintableERC20.json';
import { Contract } from 'ethers';

const contractAddress = 'INSERT_CONTRACT_ADDRESS';

function App() {
  const contract = new Contract(contractAddress, MintableERC20.abi);
  // ...
}
Add Supply Component:

Create SupplyComponent.js to fetch and display token data:
jsx
Sao chép mã
import { useCall } from '@usedapp/core';
import { utils } from 'ethers';
import { Grid } from '@mui/material';

export default function SupplyComponent({ contract }) {
  const totalSupply = useCall({ contract, method: 'totalSupply', args: [] });
  const maxSupply = useCall({ contract, method: 'MAX_TO_MINT', args: [] });
  const totalSupplyFormatted = totalSupply
    ? utils.formatEther(totalSupply.value.toString())
    : '...';
  const maxSupplyFormatted = maxSupply
    ? utils.formatEther(maxSupply.value.toString())
    : '...';

  const centeredText = { textAlign: 'center' };

  return (
    <Grid item xs={12}>
      <h3 style={centeredText}>
        Total Supply: {totalSupplyFormatted} / {maxSupplyFormatted}
      </h3>
    </Grid>
  );
}
Explanation: useCall from useDapp simplifies fetching data from the contract. The formatEther function formats large integer values for readability.
Integrate Supply Component:

Update App.js to include the SupplyComponent:
jsx
Sao chép mã
import SupplyComponent from './SupplyComponent';

function App() {
  // ...

  return (
    <Card sx={styles.card}>
      <h1 style={styles.alignCenter}>Mint Your Token!</h1>
      <SupplyComponent contract={contract} />
    </Card>
  );
}
Now, your frontend can display token supply data using the smart contract’s methods. This setup leverages the useDapp package for easier interaction with blockchain data.

Sending Transactions in Your DApp
To allow users to mint tokens by sending transactions, you'll need a component to handle user input and initiate transactions. Here’s how to set it up:

Create MintingComponent.js:
This component will include a text field for user input and a button to submit the transaction.

jsx
Sao chép mã
import { useState } from 'react';
import { useContractFunction, useEthers, MoonbaseAlpha } from '@usedapp/core';
import { Button, CircularProgress, TextField, Grid } from '@mui/material';
import { utils } from 'ethers';

export default function MintingComponent({ contract }) {
  const [value, setValue] = useState(0);
  const { account, chainId, switchNetwork } = useEthers();
  const { state, send } = useContractFunction(contract, 'purchaseMint');

  const handlePurchaseMint = async () => {
    if (chainId !== MoonbaseAlpha.chainId) {
      await switchNetwork(MoonbaseAlpha.chainId);
    }
    send({ value: utils.parseEther(value.toString()) });
  };

  const isMining = state?.status === 'Mining';

  return (
    <>
      <Grid item xs={12}>
        <TextField 
          type='number'
          onChange={(e) => setValue(e.target.value)}
          label='Enter value in DEV'
          variant='outlined'
          fullWidth
          style={{ marginBottom: '16px' }} 
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant='contained' color='primary' fullWidth
          onClick={handlePurchaseMint}
          disabled={state.status === 'Mining' || account == null}
        >
          {isMining ? <CircularProgress size={24} /> : 'Purchase Mint'}
        </Button>
      </Grid>
    </>
  );
}
Explanation:

State Management: useState is used to store the value entered by the user.
Ethers and Network: useEthers provides the user’s account information and allows network switching.
Transaction Handling: useContractFunction is used to handle the contract’s purchaseMint function. It also manages the transaction state, such as mining.
UI Elements: A text field for input and a button to initiate the minting process. The button is disabled during the transaction or if the user is not connected.
Integrate MintingComponent into App.js:
Update your App.js to include the MintingComponent:

jsx
Sao chép mã
import MintingComponent from './MintingComponent';

function App() {
  // ...

  return (
    <Card sx={styles.card}>
      <h1 style={styles.alignCenter}>Mint Your Token!</h1>
      <SupplyComponent contract={contract} />
      <MintingComponent contract={contract} />
    </Card>
  );
}
With this setup, users can input a value to mint tokens and submit transactions directly from your frontend. The MintingComponent handles both the input and transaction initiation, making it easier for users to interact with your smart contract.

Reading Events from Contracts
To listen to and display contract events, follow these steps to create a component that shows recent event logs in a table.

Create PurchaseOccurredEvents.js:
This component will listen for the PurchaseOccurred events from the smart contract and display them in a table.

jsx
Sao chép mã
import { useLogs, useBlockNumber } from '@usedapp/core';
import { utils } from 'ethers';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export default function PurchaseOccurredEvents({ contract }) {
  const blockNumber = useBlockNumber();

  // Create a filter & get the logs
  const filter = { args: [null, null], contract, event: 'PurchaseOccurred' };
  const logs = useLogs(filter, { fromBlock: blockNumber - 10000 });
  const parsedLogs = logs?.value.slice(-5).map(log => ({
    minter: log.args[0],
    amount: log.args[1],
  }));

  return (
    <Grid item xs={12} marginTop={5}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Minter</TableCell>
              <TableCell align='right'>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parsedLogs?.reverse().map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.minter}</TableCell>
                <TableCell align='right'>
                  {utils.formatEther(log.amount)} tokens
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
Explanation:

Block Number: useBlockNumber provides the current block number to ensure log queries are efficient.
Filter and Logs: useLogs fetches logs based on a filter that targets the PurchaseOccurred event.
Parsing Logs: Logs are parsed to extract event data, and the most recent five are displayed.
Display: Logs are shown in a table with minter and amount columns. The amount is formatted from wei to tokens using utils.formatEther.
Integrate PurchaseOccurredEvents into App.js:
Update your App.js to include the new PurchaseOccurredEvents component.

jsx
Sao chép mã
import PurchaseOccurredEvents from './PurchaseOccurredEvents';

function App() {
  // ...

  return (
    <Card sx={styles.card}>
      <h1 style={styles.alignCenter}>Mint Your Token!</h1>
      <SupplyComponent contract={contract} />
      <MintingComponent contract={contract} />
      <PurchaseOccurredEvents contract={contract} />
    </Card>
  );
}
With these changes, your frontend will now display a table of the most recent PurchaseOccurred events, showing who minted tokens and how many were minted. This adds real-time interactivity and feedback to your DApp.