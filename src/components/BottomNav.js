import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListIcon from '@mui/icons-material/List';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

export default function BottomNav({ value: valueProp }) {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  const currentValue = valueProp !== undefined ? valueProp : value;

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/cart');
        break;
      case 2:
        navigate('/transactions');
        break;
      case 3:
        navigate('/profile');
        break;
      default:
        break;
    }
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 65 }} elevation={3}>
      <Box sx={{ height: 5 }}></Box>
      <BottomNavigation value={currentValue} onChange={handleChange} showLabels={true}>
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Keranjang" icon={<ShoppingCartIcon />} />
        <BottomNavigationAction label="Transaksi" icon={<ListIcon />} />
        <BottomNavigationAction label="Akun" icon={<AccountCircleIcon />} />
      </BottomNavigation>
    </Paper>
  );
} 