# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Create a React Project with useDapp

Let's set up a new React project within our Hardhat project's folder. We'll use `create-react-app` to generate a new frontend directory:

```
npx create-react-app frontend
cd frontend
npm install ethers@5.6.9 @usedapp/core @mui/material @mui/system @emotion/react @emotion/styled
```
 Explanation of Dependencies
- Ethers.js: A library that assists with JSON-RPC communication.
- useDApp: A package that utilizes Ethers.js and formats them into React hooks, making it more suitable for frontend projects.
- MUI Packages: Includes @mui/material, @mui/system, @emotion/react, and @emotion/styled for styling and UI components.

# Setting Up App.js

Next, we need to set up the App.js file located in the frontend/src directory to add some visual structure to our project.

  ```
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
        {/* This is where we'll be putting our functional components! */}
      </Grid>
    </Box>
  );
}

export default App;
```
You can start the React project by running the following command from within the frontend directory:
```
npm run start
```
## Providers, Signers, and Wallets

# Create a Provider

To begin using the useDApp package, let's do some initial setup. Open the `index.js` file in your React frontend project, located in the `frontend/src` directory. We'll add a `DAppProvider` component and its configuration. This component acts similarly to the Ethers.js provider object but is designed to be used throughout your entire project via useDApp hooks.

1. Open `frontend/src/index.js`.
2. Wrap your application with the `DAppProvider` and configure it as needed.
```
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
```

# Connect to a Wallet

Next, let's add a button in the `App.js` file that allows users to connect to MetaMask. Thanks to `useDApp`, we don't need to write wallet-specific code, as the `useEthers` hook takes care of that for us.

1. Open `frontend/src/App.js`.
2. Use the `useEthers` hook to handle wallet connections.

```
function App() {
  const { activateBrowserWallet, deactivate, account } = useEthers();

  // Handle the wallet toggle
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
};
```

## Read Data from Smart Contracts

Copy the `MintableERC20.json` file from `artifacts/contracts` in the Hardhat project to the `frontend/src` directory.

```
|--artifacts
    |--@openzeppelin
    |--build-info
    |--contracts
        |--MintableERC20.sol
            |--MintableERC20.json // This is the file you're looking for!
            ...
|--cache
|--contracts
|--frontend
    |--public
    |--src
        |--MintableERC20.json // Copy the file to here!
        ...
    ...
...
```
# Create a Smart Contract Instance

To interact with our smart contract, we need to create a contract object instance using the contract's address and ABI. We'll do this in the `App.js` file.

1. Let's import the JSON file and the Ethers Contract object within App.js. 
2. Create a Contract instance: Use the contract's address and ABI to create an instance of the contract.

```
// ... other imports
import MintableERC20 from './MintableERC20.json'; 
import { Contract } from 'ethers';

const contractAddress = 'INSERT_CONTRACT_ADDRESS';

function App() {
  const contract = new Contract(contractAddress, MintableERC20.abi);
  // ...
}
```
# Interact with the Contract Interface to Read Supply Data

And let's create a new SupplyComponent within a new SupplyComponent.js file, which will use the contract interface to retrieve the token supply data and display it:

```
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
```

Now we can spice up our frontend and call the read-only functions in the contract. We'll update the frontend so that we have a place to display our supply data:

```
// ... other imports
import SupplyComponent from './SupplyComponent';

function App() {
  // ...

  return (
    {/* Wrapper Components */}
      {/* Button Component */}
      <Card sx={styles.card}>
        <h1 style={styles.alignCenter}>Mint Your Token!</h1>
        <SupplyComponent contract={contract} />
      </Card>
    {/* Wrapper Components */}
  )
}
```

## Send Transactions

If you recall from our smart contract, we want to mint some tokens by calling the purchaseMint function with some native currency. So we're going to need:
Let's create a new component called MintingComponent in a new file called MintingComponent.js.

1. A text input to let the user specify how much value to enter.

```
import { useState } from 'react';
import { useContractFunction, useEthers, MoonbaseAlpha } from '@usedapp/core';
import { Button, CircularProgress, TextField, Grid } from '@mui/material';
import { utils } from 'ethers';

export default function MintingComponent({ contract }) {
  const [value, setValue] = useState(0);
  const textFieldStyle = { marginBottom: '16px' };

  return (
    <>
      <Grid item xs={12}>
        <TextField 
          type='number'
          onChange={(e) => setValue(e.target.value)}
          label='Enter value in DEV'
          variant='outlined'
          fullWidth
          style={textFieldStyle} 
        />
      </Grid>
      {/* This is where we'll add the button */}
    </>
  );
}
```

2. A button to let the user initiate the transaction.

```
export default function MintingComponent({ contract }) {
  // ...

  // Mint transaction
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
      {/* ... */}
      <Grid item xs={12}>
        <Button
          variant='contained' color='primary' fullWidth
          onClick={handlePurchaseMint}
          disabled={state.status === 'Mining' || account == null}
        >
          {isMining? <CircularProgress size={24} /> : 'Purchase Mint'}
        </Button>
      </Grid>
    </>
  );
}
```

This code essentially boils down to using the useContractFunction hook in conjunction with the contract object, which is a lot simpler than what it does under the hood! Let's add this component to the main App.js file.

```
// ... other imports
import MintingComponent from './MintingComponent';

function App() {
  // ...

  return (
    {/* Wrapper Components */}
      {/* Button Component */}
      <Card sx={styles.card}>
        <h1 style={styles.alignCenter}>Mint Your Token!</h1>
        <SupplyComponent contract={contract} />
        <MintingComponent contract={contract} />
      </Card>
    {/* Wrapper Components */}
  )
}
```

## Read Events from Contracts

We created an event in our smart contract: event PurchaseOccurred(address minter, uint256 amount), so let's figure out how to display its information in the frontend.

Let's create a new component PurchaseOccurredEvents within a new file PurchaseOccurredEvents.js that reads the last five logs and displays them in a table:

```
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
  // Get block number to ensure that the useLogs doesn't search from 0, otherwise it will time out
  const blockNumber = useBlockNumber();

  // Create a filter & get the logs
  const filter = { args: [null, null], contract, event: 'PurchaseOccurred' };
  const logs = useLogs(filter, { fromBlock: blockNumber - 10000 });
  const parsedLogs = logs?.value.slice(-5).map((log) => log.data);
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
}
```

This too should be added to App.js.

```
// ... other imports
import PurchaseOccurredEvents from './PurchaseOccurredEvents';

function App() {
  // ...

  return (
    {/* Wrapper Components */}
      {/* Button Component */}
      <Card sx={styles.card}>
        <h1 style={styles.alignCenter}>Mint Your Token!</h1>
        <SupplyComponent contract={contract} />
        <MintingComponent contract={contract} />
        <PurchaseOccurredEvents contract={contract} />
      </Card>
    {/* Wrapper Components */}
  )
}
```

![image](https://github.com/user-attachments/assets/4df59a7a-324c-457d-9ebb-63a6c62e2bb8)











