import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import MuiBottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ListIcon from "@mui/icons-material/List";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

const BottomNavigationAction = styled(MuiBottomNavigationAction)(`
  color: #B2B2B2;
  &.Mui-selected {
    color: #508bbeff;
  }
`);

export default function BottomNav({ value: valueProp }) {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  const currentValue = valueProp !== undefined ? valueProp : value;

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate("/");
        break;
      case 1:
        navigate("/transactions");
        break;
      case 2:
        navigate("/cart");
        break;
      default:
        break;
    }
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
        zIndex: 1301,
        backgroundColor: "#242c36"
      }}
      elevation={4}
      
    >
      <BottomNavigation
        value={currentValue}
        onChange={handleChange}
        showLabels={false}
        sx={{ borderTopLeftRadius: "16px", borderTopRightRadius: "16px", backgroundColor: "#242c36" }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Transaksi" icon={<ListIcon />} />
        <BottomNavigationAction label="Keranjang" icon={<ShoppingCartIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
