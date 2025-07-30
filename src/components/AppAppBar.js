import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import MailIcon from '@mui/icons-material/Mail';
import TuneIcon from '@mui/icons-material/Tune';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListIcon from '@mui/icons-material/List';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PersonIcon from '@mui/icons-material/Person';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function PrimarySearchAppBar({ nav: nav, jenis: jenis, kondisi: kondisi, urutkan: urutkan }) {
  const [drawerState, setDrawerState] = React.useState(false);
  const [searchInputValue, setSearchInputValue] = React.useState('');
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  if (jenis === undefined || jenis === null) {
    jenis = { gb: true, ic: true }
  }

  if (kondisi === undefined || kondisi === null) {
    kondisi = { berlangsung: true, selesai: false }
  }

  if (urutkan === undefined || urutkan === null) {
    urutkan = "sesuai"
  }

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerState(open);
  };

  const handleIconClick = (newValue) => {
    if (newValue === "home") {
      navigate("/")
      return
    }
    navigate("/" + newValue)
  };

  const handleInputChange = (event) => {
    setSearchInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      navigate("/search-product?term=" + searchInputValue
        + "&gb=" + jenis.gb
        + "&ic=" + jenis.ic
        + "&berlangsung=" + kondisi.berlangsung
        + "&selesai=" + kondisi.selesai
        + "&urutkan=" + urutkan
        + "&page=" + 1
      )
    }
  };

  const list = () => (
    <Box
      width="auto"
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar>
          <Toolbar sx={{ paddingRight: { xs: "4%" }, paddingLeft: { xs: "4%" }, paddingTop: { xs: "2px" }, paddingBottom: { xs: "2px" }, backgroundColor: '#18181B' }}>
            <Box sx={{ width: { xs:'10%', sm:"25%"} }}>
              <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'flex-start' }}>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit" edge="start" onClick={toggleDrawer(true)}>
                  <TuneIcon/>
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ width: { xs:'90%', sm:"50%"} }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Cari Produk"
                  inputProps={{ 'aria-label': 'search' }}
                  fullWidth={true}
                  onKeyDown={handleKeyDown}
                  onChange={handleInputChange}
                  defaultValue={searchParams.get("term")}
                />
              </Search>
            </Box>
            <Box sx={{ width: { xs:'0%', sm:"25%"} }}>
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'flex-end' }}>
                <IconButton size="large" aria-label="home" color="inherit" onClick={() => handleIconClick("home")}>
                  {nav === "home" ? <HomeIcon /> : <HomeOutlinedIcon />}
                </IconButton>
                <IconButton size="large" aria-label="cart" color="inherit" onClick={() => handleIconClick("cart")}>
                  {nav === "cart" ? <ShoppingCartIcon /> : <ShoppingCartOutlinedIcon />}
                </IconButton>
                <IconButton size="large" aria-label="list" color="inherit" onClick={() => handleIconClick("transactions")}>
                  {nav === "transactions" ? <ListAltOutlinedIcon /> : <ListIcon />}
                </IconButton>
                <IconButton size="large" edge="end" aria-label="profile" color="inherit" onClick={() => handleIconClick("profile")}>
                  {nav === "profile" ? <PersonIcon /> : <PersonOutlinedIcon />}
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Toolbar />
      <Drawer
        anchor="bottom"
        open={drawerState}
        onClose={toggleDrawer(false)}
      >
        {list()}
      </Drawer>
    </>
  );
}
