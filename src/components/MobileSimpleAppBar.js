import { ArrowBack, Home, List, ShoppingCart } from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function MobileSimpleAppBar({ title: title }) {
  const navigate = useNavigate();

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = "simple-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => navigate("/")}>
        <IconButton size="large" color="inherit" edge="start">
          <Home />
        </IconButton>
        <p>Home</p>
      </MenuItem>
      <MenuItem onClick={() => navigate("/transactions")}>
        <IconButton size="large" color="inherit" edge="start">
          <List />
        </IconButton>
        <p>Transaksi</p>
      </MenuItem>
      <MenuItem onClick={() => navigate("/cart")}>
        <IconButton size="large" color="inherit" edge="start">
          <ShoppingCart />
        </IconButton>
        <p>Keranjang</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar
            sx={{
              paddingRight: { xs: "4%" },
              paddingLeft: { xs: "4%" },
              paddingTop: { xs: "2px" },
              paddingBottom: { xs: "2px" },
              backgroundColor: "#18181B",
            }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={() => navigate(-1)}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              fontWeight="bold"
              sx={{ display: { xs: "block", sm: "none" } }}
            >
              {title}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "flex", sm: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
      </Box>
    </>
  );
}
