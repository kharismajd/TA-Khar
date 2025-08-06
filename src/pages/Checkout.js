import { Box, Grid, Stack, Typography } from "@mui/material";
import PrimarySearchAppBar from "../components/AppAppBar";

function Checkout() {
  return (
    <>
      <PrimarySearchAppBar nav="cart" />
      <Box
        sx={{
          pr: { xs: 1, sm: 4, md: "6%" },
          pl: { xs: 1, sm: 4, md: "6%" },
          mb: { xs: 10, sm: 4 },
          mt: 1.5,
        }}
      >
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Typography sx={{ fontWeight: "bold" }} variant="h4" mt={2}>
            Checkout
          </Typography>
          <Box mb={2} />
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <Stack spacing={2} width="100%">
              <Box border={1} borderColor="divider" borderRadius={2} p={2}>
                Alamat
              </Box>
              <Box border={1} borderColor="divider" borderRadius={2} p={2}>
                Ini Produk
              </Box>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box border={1} borderColor="divider" borderRadius={2} p={2}>
              <Typography fontWeight="bold">Metode Pembayaran</Typography>
              <Typography fontWeight="bold">Metode Pembayaran</Typography>
              <Typography fontWeight="bold">Metode Pembayaran</Typography>
              <Typography fontWeight="bold">Metode Pembayaran</Typography>
              <Typography fontWeight="bold">Metode Pembayaran</Typography>
              <Typography fontWeight="bold">Metode Pembayaran</Typography>
              <Typography fontWeight="bold">Metode Pembayaran</Typography>
              <Typography fontWeight="bold">Metode Pembayaran</Typography>
              <Typography fontWeight="bold">Metode Pembayaran</Typography>
              <Typography fontWeight="bold">Metode Pembayaran</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Checkout;
