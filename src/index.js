import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#09090B",
    },
    secondary: {
      main: "#16A34A",
    },
    background: {
      default: "#09090B",
      paper: "#18181B",
    },
    text: {
      primary: "#d1d1d1",
    },
    divider: "rgba(255,255,255,0.2)",
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
