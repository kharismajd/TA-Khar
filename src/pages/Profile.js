import React from 'react';
import { Typography, Box } from '@mui/material';
import { red } from '@mui/material/colors';
import BottomNav from '../components/BottomNav';
import PrimarySearchAppBar from '../components/AppAppBar';

function Profile() {
  return (
    <>
      <PrimarySearchAppBar nav="profile"/>
      <Typography variant="h4" mt={5} align="center" sx={{ color: red[400] }}>Profile Page</Typography>
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <BottomNav value={3} />
      </Box>
    </>
  );
}

export default Profile; 