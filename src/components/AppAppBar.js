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
import { Close } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormControlLabel,
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
  const [drawerState, setDrawerState] = React.useState(false);
  const [searchInputValue, setSearchInputValue] = React.useState("");
  const [jenisMobile, setJenisMobile] = React.useState(jenis);
  const [kondisiMobile, setKondisiMobile] = React.useState(kondisi);
  const [urutkanMobile, setUrutkanMobile] = React.useState(urutkan);
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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
      <Box display="flex" mb={2}>
        <Button
          onClick={handleJenisChange}
          value="gb"
          variant="contained"
          sx={{
            backgroundColor: jenisMobile.gb ? "secondary.main" : "#2f2f2f",
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
            backgroundColor: jenisMobile.ic ? "secondary.main" : "#2f2f2f",
            mr: 1,
            textTransform: "none",
          }}
        >
          Interest Check
        </Button>
      </Box>
      <Typography variant="body1" fontWeight="bold" gutterBottom>
        Kondisi
      </Typography>
      <Box display="flex" mb={2}>
        <Button
          onClick={handleKondisiChange}
          value="berlangsung"
          variant="contained"
          sx={{
            backgroundColor: kondisiMobile.berlangsung
              ? "secondary.main"
              : "#2f2f2f",
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
              : "#2f2f2f",
            mr: 1,
            textTransform: "none",
          }}
        >
          Selesai
        </Button>
      </Box>
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

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar>
          <Toolbar
            sx={{
              paddingRight: { xs: "4%" },
              paddingLeft: { xs: "4%" },
              paddingTop: { xs: "2px" },
              paddingBottom: { xs: "2px" },
              backgroundColor: "#18181B",
            }}
          >
            <Box sx={{ width: { xs: "10%", sm: "25%" } }}>
              <Box
                sx={{
                  display: { xs: "flex", sm: "none" },
                  justifyContent: "flex-start",
                }}
              >
                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="primary"
                  edge="start"
                  onClick={toggleDrawer(!drawerState)}
                >
                  <TuneIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ width: { xs: "90%", sm: "50%" } }}>
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
            <Box sx={{ width: { xs: "0%", sm: "25%" } }}>
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  justifyContent: "flex-end",
                }}
              >
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
                  edge="end"
                  aria-label="profile"
                  color="primary"
                  onClick={() => handleIconClick("profile")}
                >
                  {nav === "profile" ? <PersonIcon /> : <PersonOutlinedIcon />}
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
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
            background: "#18181B",
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
