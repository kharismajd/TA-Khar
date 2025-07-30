import React from 'react';
import { Typography, Box } from '@mui/material';
import { red } from '@mui/material/colors';
import BottomNav from '../components/BottomNav';
import PrimarySearchAppBar from '../components/AppAppBar';

function Cart() {
  return (
    <>
      <PrimarySearchAppBar nav="cart"/>
      <Typography variant="h4" mt={5} align="center" sx={{ color: red[400] }}>Cart Page</Typography>
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <BottomNav value={1} />
      </Box>
    </>
  );
}

export default Cart; 