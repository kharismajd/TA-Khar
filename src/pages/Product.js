import React from 'react';
import { Typography, Box } from '@mui/material';
import { red } from '@mui/material/colors';
import BottomNav from '../components/BottomNav';
import PrimarySearchAppBar from '../components/AppAppBar';
import products from '../products.json'
import { useParams } from 'react-router-dom';

function Product() {
  const { productId } = useParams();
  const product = products.filter((p) => p.id == productId)[0]

  return (
    <>
      <PrimarySearchAppBar nav="home"/>
      <Box sx={{ pr: { xs: 1, sm: 4, md: '6%' }, pl: { xs: 1, sm: 4, md: '6%' }, mb: { xs: 10, sm: 4 } }}>
        <Typography variant="h4" mt={5} align="center" sx={{ color: red[400] }}>{product.title}</Typography>
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <BottomNav value={2} />
        </Box>
      </Box>
    </>
  );
}

export default Product; 