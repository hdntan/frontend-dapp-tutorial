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
  return (
    <Box sx={styles.box}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={styles.vh100}
      >
        {/* This is where we'll be putting our functional components! */}
      </Grid>
    </Box>
  );
}

export default App;
