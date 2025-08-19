import {
  Backdrop,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Radio,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PrimarySearchAppBar from "../components/AppAppBar";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import products from "../products.json";
import { CheckCircle, Notes } from "@mui/icons-material";
import MobileSimpleAppBar from "../components/MobileSimpleAppBar";

function getVariant(product, variantIds) {
  const variants = { variants: [], price: product.price };

  product.variantList.forEach((i, idx) => {
    i.variant.forEach((j, _idx) => {
      if (variantIds[idx] === j.refId) {
        variants.variants.push({ name: i.name, selected: j.name });
        variants.price = variants.price + j.priceIncrease;
      }
    });
  });

  return variants;
}

function formatPrice(n) {
  return n.toFixed(0).replace(/./g, function (c, i, a) {
    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "." + c : c;
  });
}

function calculatePrice(products, variantIds, quantities) {
  var price = 0;
  products.forEach((p, idx) => {
    price = price + getVariant(p, variantIds[idx]).price * quantities[idx];
  });
  return price;
}

function Checkout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    React.useState("direct");
  const [shipping, setShipping] = React.useState("pengirimanA");
  const [openSuccessBackdrop, setOpenSuccessBackdrop] = React.useState(false);

  const navigate = useNavigate();
  const isXs = useMediaQuery((theme) => theme.breakpoints.only("xs"));

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleShippingChange = (e) => {
    setShipping(e.target.value);
  };

  const handleOpenSuccessBackdrop = () => {
    setOpenSuccessBackdrop(true);
    setTimeout(() => {
      handleCloseSuccessBackdrop();
    }, 1000);
  };

  const handleCloseSuccessBackdrop = () => {
    setOpenSuccessBackdrop(false);
  };

  const handleBuy = () => {
    handleOpenSuccessBackdrop();
    setTimeout(() => {
      navigate("../transactions");
    }, 1000);
  };

  const productIdString = searchParams.get("productIds");
  let productIds = [];
  if (productIdString) {
    productIds = productIdString
      .split(",")
      .map((id) => parseInt(id.trim(), 10));
  }

  const quantitiesString = searchParams.get("q");
  let quantities = [];
  if (quantitiesString) {
    quantities = quantitiesString.split(",").map((q) => parseInt(q.trim(), 10));
  }

  const variantIdString = searchParams.getAll("variants");
  const variantIds = [];
  for (const i of variantIdString) {
    variantIds.push(i.split(",").map((id) => parseInt(id.trim(), 10)));
  }

  const selectedProducts = products.filter((product) =>
    productIds.includes(product.id)
  );

  const totalPrice = calculatePrice(selectedProducts, variantIds, quantities);

  return (
    <>
      {isXs ? (
        <MobileSimpleAppBar title="Checkout" />
      ) : (
        <PrimarySearchAppBar nav="cart" />
      )}

      <Backdrop
        sx={(theme) => ({
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          color: "#ffffff",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={openSuccessBackdrop}
        onClick={handleCloseSuccessBackdrop}
      >
        <Stack direction="column" spacing={1}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <CheckCircle
              sx={{ height: 200, width: 200, color: "secondary.main" }}
            />
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h5">Pembayaran Berhasil!</Typography>
          </Box>
        </Stack>
      </Backdrop>
      <Box
        sx={{
          pr: { xs: 2, sm: 4, md: "6%" },
          pl: { xs: 2, sm: 4, md: "6%" },
          mb: { xs: 14, sm: 14 },
          mt: 1,
        }}
      >
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Typography sx={{ fontWeight: "bold" }} variant="h4" mt={2}>
            Checkout
          </Typography>
          <Box mb={2} />
        </Box>
        <Box sx={{ display: { xs: "none", sm: "block", md: "none" } }}>
          <Divider sx={{ my: 2 }} />
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2} width="100%">
              <Box
                border={{ xs: 0, md: 1 }}
                borderRadius={2}
                p={{ xs: 0, md: 2 }}
                borderColor={{ xs: "divider", md: "divider" }}
              >
                <Typography variant="body1" fontWeight="bold" gutterBottom>
                  Alamat Pengiriman
                </Typography>
                <Typography variant="body1">
                  Jl. Pikachu No. 123, Kec. Pikachu, Kota Pikachu, Prov. Pikachu
                </Typography>
              </Box>
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <Divider sx={{ mt: 0, mb: 1 }} />
              </Box>
              <Box
                border={{ xs: 0, md: 1 }}
                borderRadius={2}
                p={{ xs: 0, md: 2 }}
                borderColor={{ xs: "divider", md: "divider" }}
              >
                {selectedProducts.map((p, idx) => {
                  const selectedVariants = getVariant(p, variantIds[idx]);
                  return (
                    <>
                      <Box
                        display="flex"
                        justifyContent={{
                          xs: "flex-start",
                          md: "space-between",
                        }}
                        width="100%"
                      >
                        <Box
                          display="flex"
                          sx={{ maxWidth: { xs: "100%", md: "80%" } }}
                        >
                          <Box
                            borderRadius={2}
                            component="img"
                            sx={{
                              width: { xs: "72px", sm: "96px", md: "128px" },
                              height: { xs: "72px", sm: "96px", md: "128px" },
                              objectFit: "cover",
                            }}
                            src={p.mainImage}
                          />
                          <Stack
                            ml={2}
                            gap={1}
                            direction="column"
                            maxWidth="100%"
                          >
                            <Typography>{p.title}</Typography>
                            <Box sx={{ display: { xs: "block", md: "none" } }}>
                              <Typography fontWeight="bold">
                                {"Rp" +
                                  formatPrice(selectedVariants.price) +
                                  " x " +
                                  quantities[idx]}
                              </Typography>
                            </Box>
                            <Box
                              sx={{ flexWrap: "wrap", display: "flex", gap: 1 }}
                            >
                              {selectedVariants.variants.map((v, idx) => {
                                return (
                                  <Chip
                                    label={v.selected}
                                    sx={{ size: { xs: "small", md: "" } }}
                                  />
                                );
                              })}
                            </Box>
                          </Stack>
                        </Box>
                        <Box sx={{ display: { xs: "none", md: "block" } }}>
                          <Typography fontWeight="bold">
                            {"Rp" +
                              formatPrice(selectedVariants.price) +
                              " x " +
                              quantities[idx]}
                          </Typography>
                        </Box>
                      </Box>
                      <Box mt={2} />
                    </>
                  );
                })}
                <FormControl fullWidth>
                  <Select
                    value={shipping}
                    onChange={handleShippingChange}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="pengirimanA">Kurir A (Rp0)</MenuItem>
                    <MenuItem value="pengirimanB">Kurir B (Rp0)</MenuItem>
                    <MenuItem value="pengirimanC">Kurir C (Rp0)</MenuItem>
                    <MenuItem value="pengirimanD">Kurir D (Rp0)</MenuItem>
                  </Select>
                  <Box mt={2}></Box>
                  <TextField
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Notes />
                            <Typography ml={1}>Catatan Pemesanan</Typography>
                          </InputAdornment>
                        ),
                      },
                    }}
                    size="small"
                    id="fullWidth"
                  />
                </FormControl>
              </Box>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <Divider sx={{ mt: 1, mb: 3 }} />
            </Box>
            <Box
              border={{ xs: 0, md: 1 }}
              borderRadius={2}
              p={{ xs: 0, md: 2 }}
              borderColor={{ xs: "divider", md: "divider" }}
            >
              <Typography fontWeight="bold">Metode Pembayaran</Typography>
              <Stack
                border={1}
                borderColor="divider"
                borderRadius={2}
                px={2}
                py={1}
                mt={1}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  width="100%"
                  onClick={() => handlePaymentMethodChange("direct")}
                  sx={{
                    ":hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center">
                    Direct Transfer
                  </Box>
                  <Radio
                    checked={selectedPaymentMethod === "direct"}
                    sx={{
                      color: "#b2b2b2",
                      "&.Mui-checked": { color: "secondary.main" },
                    }}
                    value="direct"
                  />
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  width="100%"
                  onClick={() => handlePaymentMethodChange("gopay")}
                  sx={{
                    ":hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Box
                      component="img"
                      sx={{
                        width: "28px",
                        height: "28px",
                      }}
                      src={"./images/gopay.webp"}
                    />
                    <Box ml={2}>GoPay</Box>
                  </Box>
                  <Radio
                    checked={selectedPaymentMethod === "gopay"}
                    value="gopay"
                    sx={{
                      color: "#b2b2b2",
                      "&.Mui-checked": { color: "secondary.main" },
                    }}
                  />
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  width="100%"
                  onClick={() => handlePaymentMethodChange("ovo")}
                  sx={{
                    ":hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Box
                      component="img"
                      sx={{
                        width: "32px",
                        height: "32px",
                      }}
                      src={"./images/ovo.webp"}
                    />
                    <Box ml={2}>OVO</Box>
                  </Box>
                  <Radio
                    checked={selectedPaymentMethod === "ovo"}
                    value="ovo"
                    sx={{
                      color: "#b2b2b2",
                      "&.Mui-checked": { color: "secondary.main" },
                    }}
                  />
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  width="100%"
                  onClick={() => handlePaymentMethodChange("dana")}
                  sx={{
                    ":hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Box
                      component="img"
                      borderRadius={2}
                      sx={{
                        width: "32px",
                        height: "32px",
                      }}
                      src={"./images/dana.jpg"}
                    />
                    <Box ml={2}>Dana</Box>
                  </Box>
                  <Radio
                    checked={selectedPaymentMethod === "dana"}
                    value="dana"
                    sx={{
                      color: "#b2b2b2",
                      "&.Mui-checked": { color: "secondary.main" },
                    }}
                  />
                </Box>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography fontWeight="bold" mb={2}>
                Rincian Belanja
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Total Harga</Typography>
                <Typography variant="body2">
                  Rp{formatPrice(totalPrice)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Ongkos Kirim</Typography>
                <Typography variant="body2">Rp0</Typography>
              </Box>
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1" fontWeight="bold">
                    Total Tagihan
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {totalPrice === 0 ? "-" : "Rp" + formatPrice(totalPrice)}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ mt: 2, textTransform: "none" }}
                  onClick={handleBuy}
                >
                  Beli
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box
        width="100%"
        justifyContent="center"
        p={2}
        sx={{
          position: "fixed",
          bottom: 0,
          display: { xs: "block", md: "none" },
          backgroundColor: "#18181B",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body1">Total Tagihan</Typography>
          <Typography variant="body1" fontWeight="bold">
            {totalPrice === 0 ? "-" : "Rp" + formatPrice(totalPrice)}
          </Typography>
        </Box>
        <Box display="flex">
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 1, textTransform: "none" }}
            onClick={handleBuy}
          >
            Beli
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default Checkout;
