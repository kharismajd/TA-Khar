import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d1d1d1',
      contrastText: "#d1d1d1"
    },
    secondary: {
      main: '#00A329',
    },
    background: {
      default: '#09090B',
      paper: '#18181b',
    },
    text: {
      primary: '#d1d1d1',
    },
    divider: 'rgba(255,255,255,0.2)',
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <App />
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
