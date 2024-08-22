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