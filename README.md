## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Create a React Project with useDapp

Chúng ta hãy thiết lập một dự án React mới trong thư mục dự án Hardhat của mình. Chúng ta sẽ sử dụng create-react-app để tạo ra một thư mục frontend mới:

```
npm create vite@latest frontend -- --template react
cd frontend
npm install ethers@5.6.9 @usedapp/core @mui/material @mui/system @emotion/react @emotion/styled
```

 Giải thích về các thư viện phụ thuộc:
- Ethers.js: Một thư viện giúp giao tiếp với `JSON-RPC`.
- useDApp: Một gói thư viện sử dụng `Ethers.js` và chuyển đổi chúng thành các hook của React, giúp phù hợp hơn cho các dự án frontend.
- MUI Packages: Bao gồm `@mui/material, @mui/system, @emotion/react, và @emotion/styled` để tạo kiểu và các thành phần giao diện người dùng (UI components).

## Setting Up App.jsx

Tiếp theo, chúng ta cần thiết lập tệp `App.jsx` nằm trong thư mục `frontend/src` để thêm một số cấu trúc hiển thị cho dự án của mình.

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

Bạn có thể khởi động dự án React bằng cách chạy lệnh sau từ trong thư mục frontend:

```
npm run start
```
# Providers, Signers, and Wallets

## Create a Provider

Để bắt đầu sử dụng gói useDApp, hãy thực hiện một số thiết lập ban đầu. Mở tệp `main.jsx` trong dự án frontend React của bạn, nằm trong thư mục frontend/src. Chúng ta sẽ thêm một thành phần `DAppProvider` và cấu hình cho nó. Thành phần này hoạt động tương tự như đối tượng provider của Ethers.js nhưng được thiết kế để sử dụng xuyên suốt dự án của bạn thông qua các hook của useDApp.

1. Mở tệp `frontend/src/main.jsx`.
2. Bọc ứng dụng của bạn với `DAppProvider` và cấu hình nó theo nhu cầu.

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

## Connect to a Wallet

Tiếp theo, hãy thêm một nút vào tệp `App.jsx` để cho phép người dùng kết nối với MetaMask. Nhờ có `useDApp`, chúng ta không cần phải viết mã cụ thể cho ví, vì hook `useEthers` sẽ lo liệu việc đó cho chúng ta.

1. Mở tệp `frontend/src/App.jsx`.
2. Sử dụng hook `useEthers` để xử lý việc kết nối với ví.

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

# Read Data from Smart Contracts

Sao chép tệp `MintableERC20.json` từ thư mục `artifacts/contracts` trong dự án Hardhat vào thư mục `frontend/src`.

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
## Create a Smart Contract Instance

Để tương tác với hợp đồng thông minh của chúng ta, chúng ta cần tạo một đối tượng hợp đồng sử dụng địa chỉ và ABI của hợp đồng. Chúng ta sẽ thực hiện việc này trong tệp `App.jsx`.

1. Hãy import tệp JSON và đối tượng Ethers Contract vào trong App.jsx.
2. Tạo một đối tượng Contract: Sử dụng địa chỉ và ABI của hợp đồng để tạo một instance của hợp đồng.

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
## Interact with the Contract Interface to Read Supply Data

Và hãy tạo một component mới có tên `SupplyComponent` trong một tệp mới là `SupplyComponent.jsx`, component này sẽ sử dụng giao diện hợp đồng để truy xuất dữ liệu về nguồn cung token và hiển thị nó.

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

Bây giờ, chúng ta có thể làm cho giao diện frontend của mình thêm sinh động và gọi các hàm chỉ đọc trong contract. Chúng ta sẽ cập nhật frontend để có một nơi hiển thị về supply data:

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

# Send Transactions

Nếu bạn nhớ từ smart contract của chúng ta, chúng ta muốn phát hành một số token bằng cách gọi hàm `purchaseMint` với một số tiền bằng đồng tiền gốc. Vì vậy, chúng ta sẽ cần:
Tạo một component mới có tên `MintingComponent` trong một tệp mới gọi là `MintingComponent.jsx`.

```
import { useState } from 'react';
import { useContractFunction, useEthers, MoonbaseAlpha } from '@usedapp/core';
import { Button, CircularProgress, TextField, Grid } from '@mui/material';
import { utils } from 'ethers';

export default function MintingComponent({ contract }) {
  const [value, setValue] = useState(0);
  const textFieldStyle = { marginBottom: '16px' };

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
          style={textFieldStyle} 
        />
      </Grid>
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

Mã này chủ yếu là việc sử dụng hook `useContractFunction` kết hợp với contract object, điều này đơn giản hơn rất nhiều so với những gì nó thực hiện dưới lớp! Hãy thêm component này vào tệp chính `App.jsx`.

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

# Read Events from Contracts

Chúng ta đã tạo một sự kiện trong smart contract của mình: `event PurchaseOccurred(address minter, uint256 amount)`, vì vậy hãy tìm cách hiển thị thông tin của nó trên frontend.

Hãy tạo một component mới có tên `PurchaseOccurredEvents` trong một tệp mới là `PurchaseOccurredEvents.jsx`, component này sẽ đọc năm nhật ký gần đây nhất và hiển thị chúng trong một bảng.

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
```

Điều này cũng nên được thêm vào `App.jsx`.


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













