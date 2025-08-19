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
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

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

export default function MobileTransactionAppBar({
  term: term,
  status: status,
}) {
  const [drawerState, setDrawerState] = React.useState(false);
  const [transactionTerm, setTransactionTerm] = React.useState(term);
  const [statusMobile, setStatusMobile] = React.useState(status);
  const [tanggal, setTanggal] = React.useState("semua");
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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

  const handleInputChange = (event) => {
    setTransactionTerm(event.target.value);
  };

  const handleStatusMobileChange = (event) => {
    setStatusMobile(event.target.value);
  };

  const handleTanggalChange = (event) => {
    setTanggal(event.target.value);
  };

  const applyFilter = (
    transactionTerm,
    status,
    startDate,
    endDate,
    page,
    transactionDetailStep,
    transactionId,
    productionInfoId
  ) => {
    navigate(
      "/transactions?transactionTerm=" +
        transactionTerm +
        "&status=" +
        status +
        "&startDate=" +
        startDate +
        "&endDate=" +
        endDate +
        "&transactionPage=" +
        page +
        "&transactionDetailStep=" +
        transactionDetailStep +
        "&transactionId=" +
        transactionId +
        "&productionInfoId=" +
        productionInfoId
    );
  };

  const getDateFromSelection = (selection) => {
    const date = { startDate: null, endDate: null };
    const today = dayjs()
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0);
    if (selection === "1bulan") {
      date.startDate = today.subtract(1, "month");
      return date;
    }

    if (selection === "6bulan") {
      date.startDate = today.subtract(6, "month");
      return date;
    }

    if (selection === "3tahun") {
      date.startDate = today.subtract(3, "year");
      return date;
    }

    return date;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setDrawerState(false);
      event.preventDefault();
      const date = getDateFromSelection(tanggal);
      applyFilter(
        transactionTerm,
        statusMobile,
        date.startDate,
        date.endDate,
        1,
        0,
        null,
        null
      );
      scrollToTop();
    }
  };

  const handleSearchTransaction = () => {
    setDrawerState(false);
    const date = getDateFromSelection(tanggal);
    applyFilter(
      transactionTerm,
      statusMobile,
      date.startDate,
      date.endDate,
      1,
      0,
      null,
      null
    );
    scrollToTop();
  };

  const filterDrawer = () => (
    <Box width="auto" role="presentation" p={2}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body1" fontWeight="bold" gutterBottom>
          Status
        </Typography>
        <Close onClick={toggleDrawer(false)} />
      </Box>
      <Container display="flex" disableGutters>
        <Button
          onClick={handleStatusMobileChange}
          value="semua"
          variant="contained"
          sx={{
            backgroundColor:
              statusMobile === "semua" ? "secondary.main" : "#3e454e",
            mb: 1,
            mr: 1,
            textTransform: "none",
          }}
        >
          Semua
        </Button>
        <Button
          onClick={handleStatusMobileChange}
          value="selesai"
          variant="contained"
          sx={{
            backgroundColor:
              statusMobile === "selesai" ? "secondary.main" : "#3e454e",
            mb: 1,
            mr: 1,
            textTransform: "none",
          }}
        >
          Selesai
        </Button>
        <Button
          onClick={handleStatusMobileChange}
          value="dikirim"
          variant="contained"
          sx={{
            backgroundColor:
              statusMobile === "dikirim" ? "secondary.main" : "#3e454e",
            mb: 1,
            mr: 1,
            textTransform: "none",
          }}
        >
          Dikirim
        </Button>
        <Button
          onClick={handleStatusMobileChange}
          value="diproduksi"
          variant="contained"
          sx={{
            backgroundColor:
              statusMobile === "diproduksi" ? "secondary.main" : "#3e454e",
            mb: 1,
            mr: 1,
            textTransform: "none",
          }}
        >
          Diproduksi
        </Button>
        <Button
          onClick={handleStatusMobileChange}
          value="gbOngoing"
          variant="contained"
          sx={{
            backgroundColor:
              statusMobile === "gbOngoing" ? "secondary.main" : "#3e454e",
            mb: 1,
            mr: 1,
            textTransform: "none",
          }}
        >
          GB Ongoing
        </Button>
        <Button
          onClick={handleStatusMobileChange}
          value="gagal"
          variant="contained"
          sx={{
            backgroundColor:
              statusMobile === "gagal" ? "secondary.main" : "#3e454e",
            mb: 1,
            mr: 1,
            textTransform: "none",
          }}
        >
          Gagal
        </Button>
      </Container>
      <Box mb={2} />
      <Typography variant="body1" fontWeight="bold" gutterBottom>
        Tanggal
      </Typography>
      <Box mb={2}>
        <FormControl>
          <RadioGroup
            defaultValue="semua"
            name="radio-buttons-group"
            value={tanggal}
            onChange={handleTanggalChange}
          >
            <FormControlLabel
              control={
                <Radio
                  value="semua"
                  sx={{
                    color: "#b2b2b2",
                    "&.Mui-checked": { color: "secondary.main" },
                  }}
                />
              }
              label="Semua Tanggal Transaksi"
            />
            <FormControlLabel
              control={
                <Radio
                  value="1bulan"
                  sx={{
                    color: "#b2b2b2",
                    "&.Mui-checked": { color: "secondary.main" },
                  }}
                />
              }
              label="1 Bulan Terakhir"
            />
            <FormControlLabel
              control={
                <Radio
                  value="6bulan"
                  sx={{
                    color: "#b2b2b2",
                    "&.Mui-checked": { color: "secondary.main" },
                  }}
                />
              }
              label="6 Bulan Terakhir"
            />
            <FormControlLabel
              control={
                <Radio
                  value="3tahun"
                  sx={{
                    color: "#b2b2b2",
                    "&.Mui-checked": { color: "secondary.main" },
                  }}
                />
              }
              label="3 Tahun Terakhir"
            />
          </RadioGroup>
        </FormControl>
      </Box>
      <Button
        onClick={handleSearchTransaction}
        variant="contained"
        fullWidth
        sx={{ textTransform: "none", backgroundColor: "secondary.main" }}
      >
        Tampilkan Transaksi
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
                  placeholder="Cari Transaksi"
                  inputProps={{ "aria-label": "search" }}
                  fullWidth={true}
                  onKeyDown={handleKeyDown}
                  onChange={handleInputChange}
                  defaultValue={transactionTerm}
                />
              </Search>
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
