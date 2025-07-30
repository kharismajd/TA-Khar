import React from "react";
import { Typography, Box } from "@mui/material";
import { red } from "@mui/material/colors";
import BottomNav from "../components/BottomNav";
import PrimarySearchAppBar from "../components/AppAppBar";

function Transactions() {
  return (
    <>
      <PrimarySearchAppBar nav="transactions" />
      <Typography variant="h4" mt={5} align="center" sx={{ color: red[400] }}>
        Transactions Page
      </Typography>
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <BottomNav value={2} />
      </Box>
    </>
  );
}

export default Transactions;
