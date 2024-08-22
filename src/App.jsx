import { useEthers } from "@usedapp/core";
import { Button, Grid, Card } from "@mui/material";
import { Box } from "@mui/system";
import "./App.css";

const styles = {
  box: { minHeight: "100vh", backgroundColor: "#1b3864" },
  vh100: { minHeight: "100vh" },
  card: { borderRadius: 4, padding: 4, maxWidth: "550px", width: "100%" },
  alignCenter: { textAlign: "center" },
};

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
        direction="column"
        alignItems="center"
        justifyContent="center"
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

export default App;
