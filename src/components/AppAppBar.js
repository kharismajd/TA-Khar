import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MailIcon from "@mui/icons-material/Mail";
import TuneIcon from "@mui/icons-material/Tune";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ListIcon from "@mui/icons-material/List";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PersonIcon from "@mui/icons-material/Person";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { Close, Home, ShoppingCart } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function PrimarySearchAppBar({
  nav: nav,
  jenis: jenis,
  kondisi: kondisi,
  urutkan: urutkan,
  withMenu: withMenu,
}) {
  if (jenis === undefined || jenis === null) {
    jenis = { gb: true, ic: true };
  }

  if (kondisi === undefined || kondisi === null) {
    kondisi = { berlangsung: true, selesai: false };
  }

  if (urutkan === undefined || urutkan === null) {
    urutkan = "sesuai";
  }

  if (withMenu === undefined || withMenu === null) {
    withMenu = false;
  }

  const [drawerState, setDrawerState] = React.useState(false);
  const [searchInputValue, setSearchInputValue] = React.useState("");
  const [jenisMobile, setJenisMobile] = React.useState(jenis);
  const [kondisiMobile, setKondisiMobile] = React.useState(kondisi);
  const [urutkanMobile, setUrutkanMobile] = React.useState(urutkan);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerState(open);
  };

  const handleIconClick = (newValue) => {
    if (newValue === "home") {
      navigate("/");
      return;
    }
    navigate("/" + newValue);
  };

  const handleInputChange = (event) => {
    setSearchInputValue(event.target.value);
  };

  const handleJenisChange = (event) => {
    const jenisCopy = { ...jenisMobile };
    jenisCopy[event.target.value] = !jenisCopy[event.target.value];
    setJenisMobile(jenisCopy);
  };

  const handleKondisiChange = (event) => {
    const kondisiCopy = { ...kondisiMobile };
    kondisiCopy[event.target.value] = !kondisiCopy[event.target.value];
    setKondisiMobile(kondisiCopy);
  };

  const handleUrutkanChange = (event) => {
    setUrutkanMobile(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setDrawerState(false);
      navigate(
        "/search-product?term=" +
          searchInputValue +
          "&gb=" +
          jenisMobile.gb +
          "&ic=" +
          jenisMobile.ic +
          "&berlangsung=" +
          kondisiMobile.berlangsung +
          "&selesai=" +
          kondisiMobile.selesai +
          "&urutkan=" +
          urutkanMobile +
          "&page=" +
          1
      );
    }
  };

  const handleSearchProduct = () => {
    setDrawerState(false);
    navigate(
      "/search-product?term=" +
        searchInputValue +
        "&gb=" +
        jenisMobile.gb +
        "&ic=" +
        jenisMobile.ic +
        "&berlangsung=" +
        kondisiMobile.berlangsung +
        "&selesai=" +
        kondisiMobile.selesai +
        "&urutkan=" +
        urutkanMobile +
        "&page=" +
        1
    );
    scrollToTop();
  };

  const filterDrawer = () => (
    <Box width="auto" role="presentation" p={2}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body1" fontWeight="bold" gutterBottom>
          Jenis
        </Typography>
        <Close onClick={toggleDrawer(false)} />
      </Box>
      <Container display="flex" disableGutters>
        <Button
          onClick={handleJenisChange}
          value="gb"
          variant="contained"
          sx={{
            backgroundColor: jenisMobile.gb ? "secondary.main" : "#3e454e",
            mr: 1,
            textTransform: "none",
          }}
        >
          Group Buy
        </Button>
        <Button
          onClick={handleJenisChange}
          value="ic"
          variant="contained"
          sx={{
            backgroundColor: jenisMobile.ic ? "secondary.main" : "#3e454e",
            mr: 1,
            textTransform: "none",
          }}
        >
          Interest Check
        </Button>
      </Container>
      <Box mb={2} />
      <Typography variant="body1" fontWeight="bold" gutterBottom>
        Kondisi
      </Typography>
      <Container display="flex" disableGutters>
        <Button
          onClick={handleKondisiChange}
          value="berlangsung"
          variant="contained"
          sx={{
            backgroundColor: kondisiMobile.berlangsung
              ? "secondary.main"
              : "#3e454e",
            mr: 1,
            textTransform: "none",
          }}
        >
          Berlangsung
        </Button>
        <Button
          onClick={handleKondisiChange}
          value="selesai"
          variant="contained"
          sx={{
            backgroundColor: kondisiMobile.selesai
              ? "secondary.main"
              : "#3e454e",
            mr: 1,
            textTransform: "none",
          }}
        >
          Selesai
        </Button>
      </Container>
      <Box mb={2} />
      <Typography variant="body1" fontWeight="bold" gutterBottom>
        Urutkan
      </Typography>
      <Box mb={2}>
        <FormControl>
          <RadioGroup
            defaultValue="sesuai"
            name="radio-buttons-group"
            value={urutkanMobile}
            onChange={handleUrutkanChange}
          >
            <FormControlLabel
              control={
                <Radio
                  value="sesuai"
                  sx={{
                    color: "#b2b2b2",
                    "&.Mui-checked": { color: "secondary.main" },
                  }}
                />
              }
              label="Paling Sesuai"
            />
            <FormControlLabel
              control={
                <Radio
                  value="terbaru"
                  sx={{
                    color: "#b2b2b2",
                    "&.Mui-checked": { color: "secondary.main" },
                  }}
                />
              }
              label="Terbaru"
            />
            <FormControlLabel
              control={
                <Radio
                  value="harga-tertinggi"
                  sx={{
                    color: "#b2b2b2",
                    "&.Mui-checked": { color: "secondary.main" },
                  }}
                />
              }
              label="Harga Tertinggi"
            />
            <FormControlLabel
              control={
                <Radio
                  value="harga-terendah"
                  sx={{
                    color: "#b2b2b2",
                    "&.Mui-checked": { color: "secondary.main" },
                  }}
                />
              }
              label="Harga Terendah"
            />
          </RadioGroup>
        </FormControl>
      </Box>
      <Button
        onClick={handleSearchProduct}
        variant="contained"
        fullWidth
        sx={{ textTransform: "none", backgroundColor: "secondary.main" }}
      >
        Tampilkan Produk
      </Button>
    </Box>
  );

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
          <ListIcon />
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
        <AppBar>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Toolbar
              sx={{
                paddingRight: { xs: "4%" },
                paddingLeft: { xs: "4%" },
                paddingTop: { xs: "2px" },
                paddingBottom: { xs: "2px" },
                backgroundColor: "#19212c",
              }}
            >
              <Box width="25%" />
              <Box width="50%">
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon color="primary" />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Cari Produk"
                    inputProps={{ "aria-label": "search" }}
                    fullWidth={true}
                    onKeyDown={handleKeyDown}
                    onChange={handleInputChange}
                    defaultValue={searchParams.get("term")}
                  />
                </Search>
              </Box>
              <Box width="25%">
                <Box display="flex" justifyContent="flex-end">
                  <IconButton
                    size="large"
                    aria-label="home"
                    color="primary"
                    onClick={() => handleIconClick("home")}
                  >
                    {nav === "home" ? <HomeIcon /> : <HomeOutlinedIcon />}
                  </IconButton>
                  <IconButton
                    size="large"
                    aria-label="list"
                    color="primary"
                    onClick={() => handleIconClick("transactions")}
                  >
                    {nav === "transactions" ? (
                      <ListAltOutlinedIcon />
                    ) : (
                      <ListIcon />
                    )}
                  </IconButton>
                  <IconButton
                    size="large"
                    aria-label="cart"
                    color="primary"
                    onClick={() => handleIconClick("cart")}
                  >
                    {nav === "cart" ? (
                      <ShoppingCartIcon />
                    ) : (
                      <ShoppingCartOutlinedIcon />
                    )}
                  </IconButton>
                </Box>
              </Box>
            </Toolbar>
          </Box>
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <Toolbar
              sx={{
                paddingRight: { xs: "4%" },
                paddingLeft: { xs: "4%" },
                paddingTop: { xs: "2px" },
                paddingBottom: { xs: "2px" },
                backgroundColor: "#19212c",
              }}
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer(!drawerState)}
              >
                <TuneIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1 }}>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Cari Produk"
                    inputProps={{ "aria-label": "search" }}
                    fullWidth={true}
                    onKeyDown={handleKeyDown}
                    onChange={handleInputChange}
                    defaultValue={searchParams.get("term")}
                  />
                </Search>
              </Box>
              {withMenu && (
                <Box display="flex">
                  <IconButton
                    size="large"
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    color="inherit"
                    edge="end"
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              )}
            </Toolbar>
          </Box>
        </AppBar>
        {renderMobileMenu}
      </Box>
      <Toolbar />
      <Drawer
        disableEnforceFocus
        anchor="top"
        open={drawerState}
        onClose={toggleDrawer(false)}
        sx={{
          zIndex: 1099,
          "& .MuiPaper-root": {
            background: "#19212c",
            borderRadius: 2,
          },
        }}
      >
        <Toolbar />
        {filterDrawer()}
      </Drawer>
    </>
  );
}
