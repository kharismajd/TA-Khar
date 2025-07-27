import React from 'react';
import { Typography, Box } from '@mui/material';
import { red } from '@mui/material/colors';
import BottomNav from '../components/BottomNav';

function SearchProduct() {
  return (
    <>
      <Typography variant="h4" mt={5} align="center" sx={{ color: red[400] }}>Search Product Page</Typography>
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <BottomNav />
      </Box>
    </>
  );
}

export default SearchProduct; 