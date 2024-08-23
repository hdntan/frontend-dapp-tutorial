# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Create a React Project with useDapp

Let's set up a new React project within our Hardhat project's folder. We'll use `create-react-app` to generate a new frontend directory:

```bash
npx create-react-app frontend
cd frontend
npm install ethers@5.6.9 @usedapp/core @mui/material @mui/system @emotion/react @emotion/styled
bash
```
 Explanation of Dependencies
- Ethers.js: A library that assists with JSON-RPC communication.
- useDApp: A package that utilizes Ethers.js and formats them into React hooks, making it more suitable for frontend projects.
- MUI Packages: Includes @mui/material, @mui/system, @emotion/react, and @emotion/styled for styling and UI components.

# Setting Up App.js

Next, we need to set up the App.js file located in the frontend/src directory to add some visual structure to our project.

  ```bash
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
bash
```
