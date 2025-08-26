import React from "react";
import {
  Typography,
  Box,
  Divider,
  Grid,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stack,
  Chip,
  TextField,
  useMediaQuery,
  Modal,
  Container,
  Dialog,
  IconButton,
  DialogContent,
  DialogActions,
  DialogTitle,
  SwipeableDrawer,
} from "@mui/material";
import { red } from "@mui/material/colors";
import BottomNav from "../components/BottomNav";
import PrimarySearchAppBar from "../components/AppAppBar";
import products from "../products.json";
import cart from "../cart.json";
import { useNavigate } from "react-router-dom";
import {
  AccessAlarm,
  Add,
  Close,
  Delete,
  ExpandMore,
  Remove,
} from "@mui/icons-material";
import MobileSimpleAppBar from "../components/MobileSimpleAppBar";
import styled from "@emotion/styled";

function formatPrice(n) {
  return n.toFixed(0).replace(/./g, function (c, i, a) {
    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "." + c : c;
  });
}

const isNumbers = (str) => /^(\s*|\d+)$/.test(str);

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
  },
}));

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: "#e1e1e1",
  borderRadius: 3,
  top: 20,
  position: "absolute",
  left: "calc(50% - 15px)",
}));

function Cart() {
  const navigate = useNavigate();
  const isXs = useMediaQuery((theme) => theme.breakpoints.only("xs"));
  const isSm = useMediaQuery((theme) => theme.breakpoints.only("sm"));

  const cartInitState = structuredClone(cart);
  var totalItemInitState = 0;
  for (const store of cartInitState) {
    store["checked"] = false;
    for (const p of store.products) {
      p["checked"] = false;
      totalItemInitState = totalItemInitState + 1;
    }
  }

  const [isAllChecked, setIsAllChecked] = React.useState(false);
  const [isAllNotChecked, setIsAllNotChecked] = React.useState(true);
  const [cartData, setCartData] = React.useState(cartInitState);
  const [totalItem, setTotalItem] = React.useState(totalItemInitState);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [openChangeVariantDialog, setOpenChangeVariantDialog] =
    React.useState(false);
  const [openChangeVariantDrawer, setOpenChangeVariantDrawer] =
    React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [selectedCartProduct, setSelectedCartProduct] = React.useState(null);
  const [tempVariant, setTempVariant] = React.useState(null);

  const handleCloseChangeVariantDialog = () => {
    setOpenChangeVariantDialog(false);
  };

  const handleCloseChangeVariantDrawer = () => {
    setOpenChangeVariantDrawer(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCheckAllButton = (value) => {
    setIsAllChecked(value);
    const cartDataCopy = [...cartData];
    for (const store of cartDataCopy) {
      store["checked"] = value;
      for (const product of store.products) {
        product["checked"] = value;
      }
    }
    setCartData(cartDataCopy);
  };

  const handleStoreCheckButton = (storeId) => {
    const cartDataCopy = [...cartData];
    var isAllStoreChecked = true;

    for (const store of cartData) {
      if (store.storeId === storeId) {
        store["checked"] = !store["checked"];
        for (const product of store.products) {
          product["checked"] = store["checked"];
        }
      }

      if (!store["checked"]) {
        isAllStoreChecked = false;
      }
    }

    setIsAllChecked(isAllStoreChecked);
    setCartData(cartDataCopy);
  };

  const handleProductCheckButton = (storeId, cartProductId) => {
    const cartDataCopy = [...cartData];
    var isAllStoreChecked = true;
    var isAllProductChecked = true;

    for (const store of cartDataCopy) {
      if (store.storeId === storeId) {
        for (const product of store.products) {
          if (cartProductId === product.id) {
            product["checked"] = !product["checked"];
          }

          if (!product["checked"]) {
            isAllProductChecked = false;
          }
        }

        store["checked"] = isAllProductChecked;
      }

      if (!store["checked"]) {
        isAllStoreChecked = false;
      }
    }

    setIsAllChecked(isAllStoreChecked);
    setCartData(cartDataCopy);
  };

  const handleDecrement = (storeId, cartProductId) => {
    const cartDataCopy = [...cartData];
    const store = cartDataCopy.filter((c) => c.storeId === storeId)[0];
    const cartProduct = store.products.filter((s) => s.id === cartProductId)[0];

    if (cartProduct.quantity >= 2) {
      cartProduct.quantity = cartProduct.quantity - 1;
    }

    setCartData(cartDataCopy);
  };

  const handleIncrement = (storeId, cartProductId) => {
    const cartDataCopy = [...cartData];
    const store = cartDataCopy.filter((c) => c.storeId === storeId)[0];
    const cartProduct = store.products.filter((s) => s.id === cartProductId)[0];

    cartProduct.quantity = cartProduct.quantity + 1;

    setCartData(cartDataCopy);
  };

  const handleQuantityInputChange = (event, storeId, cartProductId) => {
    const { value } = event.target;
    const cartDataCopy = [...cartData];
    const store = cartDataCopy.filter((c) => c.storeId === storeId)[0];
    const cartProduct = store.products.filter((s) => s.id === cartProductId)[0];

    if (isNumbers(value)) {
      cartProduct.quantity = value;
    }

    setCartData(cartDataCopy);
  };

  const handleOnBlur = (event, storeId, cartProductId) => {
    const { value } = event.target;
    const cartDataCopy = [...cartData];
    const store = cartDataCopy.filter((c) => c.storeId === storeId)[0];
    const cartProduct = store.products.filter((s) => s.id === cartProductId)[0];

    if (value === "" || value === null || parseInt(value) === 0) {
      cartProduct.quantity = 1;
    }

    setCartData(cartDataCopy);
  };

  const handleDeleteItem = (storeId, cartProductId) => {
    const cartDataCopy = [...cartData];

    cartDataCopy.forEach((c, i) => {
      if (c.storeId === storeId) {
        c.products.forEach((p, j) => {
          if (p.id === cartProductId) {
            c.products.splice(j, 1);
          }
        });
      }
    });

    setCartData(cartDataCopy);
    setTotalItem(totalItem - 1);
  };

  const handleBuyClick = () => {
    const cartDataCopy = [...cartData];

    const productIds = [];
    const variants = [];
    const q = [];
    cartDataCopy.forEach((c, i) => {
      c.products.forEach((p, j) => {
        if (p.checked) {
          productIds.push(p.productId);
          q.push(p.quantity);
          var variant = [];
          p.variants.forEach((v, k) => {
            variant.push(v.refId);
          });
          variants.push(variant);
        }
      });
    });

    const productIdsString = productIds.join(",");
    const qString = q.join(",");
    var variantsString = "";
    variants.forEach((v, i) => {
      if (i == 0) {
        variantsString = variantsString + "variants=" + v.join(",");
      } else {
        variantsString = variantsString + "&variants=" + v.join(",");
      }
    });

    const queryString =
      "productIds=" + productIdsString + "&q=" + qString + "&" + variantsString;
    navigate("/checkout?" + queryString);
  };

  const getVariantPrice = (product, variants) => {
    var price = product.price;
    for (const v of variants) {
      var pVariant = product.variantList.filter((sv) => sv.name === v.name)[0];
      var priceIncrement = pVariant.variant.filter(
        (sv) => sv.refId === v.refId
      )[0].priceIncrease;
      price = price + priceIncrement;
    }
    return price;
  };

  const getSelectedVariant = (product, variant) => {
    var pVariant = product.variantList.filter(
      (sv) => sv.name === variant.name
    )[0];
    var selectedVariant = pVariant.variant.filter(
      (sv) => sv.refId === variant.refId
    )[0].name;
    return selectedVariant;
  };

  const calculatePrice = () => {
    var totalPrice = 0;
    for (const store of cartData) {
      for (const cartProduct of store.products) {
        if (cartProduct.checked) {
          const product = products.filter(
            (p) => p.id === cartProduct.productId
          )[0];
          totalPrice =
            totalPrice +
            getVariantPrice(product, cartProduct.variants) *
              cartProduct.quantity;
        }
      }
    }
    setTotalPrice(totalPrice);
  };

  const checkIsAllNotChecked = () => {
    var isAllNotChecked = true;
    for (const store of cartData) {
      for (const cartProduct of store.products) {
        if (cartProduct.checked) {
          isAllNotChecked = false;
          break;
        }
      }

      if (!isAllNotChecked) {
        break;
      }
    }

    setIsAllNotChecked(isAllNotChecked);
  };

  const countChecked = () => {
    var checked = 0;
    for (const store of cartData) {
      for (const cartProduct of store.products) {
        if (cartProduct.checked) {
          checked = checked + 1;
        }
      }
    }

    return checked;
  };

  const handleChangeVarian = (productDetail, storeProduct) => {
    setSelectedProduct(productDetail);
    setSelectedCartProduct(storeProduct);
    setTempVariant([...storeProduct.variants]);
    !isXs ? setOpenChangeVariantDialog(true) : setOpenChangeVariantDrawer(true);
  };

  const handleVariantButtonClick = (variantName, refId) => {
    const tempVariantCopy = structuredClone(tempVariant);
    tempVariantCopy.find((e) => e.name === variantName).refId = refId;
    setTempVariant(tempVariantCopy);
    getImageIndex();
  };

  const handleSaveProductVariant = (storeProduct) => {
    setOpenChangeVariantDialog(false);
    setOpenChangeVariantDrawer(false);
    storeProduct.variants = tempVariant;
    const cartDataCopy = [...cartData];
    setCartData(cartDataCopy);
  };

  const getImageIndex = () => {
    var refId = "";
    for (const v of tempVariant) {
      refId = refId + v.refId.toString();
    }

    var found = false;
    var idx = 0;
    for (const images of selectedProduct.images) {
      if (images.refId.includes(parseInt(refId))) {
        found = true;
        break;
      }
      idx = idx + 1;
    }

    console.log(idx);
    return found ? idx : 0;
  };

  const renderVariantChip = (product) => {
    return (
      <>
        {product.variantList.map((variant) => (
          <>
            {variant.variant.map((variantSelection) => (
              <>
                {tempVariant.find((e) => e.name === variant.name).refId ===
                  variantSelection.refId && (
                  <Chip
                    sx={{ borderRadius: "4px", backgroundColor: "#508bbeff" }}
                    label={variantSelection.name}
                  />
                )}
              </>
            ))}
          </>
        ))}
      </>
    );
  };

  const renderChangeVariantDrawer = (productDetail, storeProduct) => {
    return (
      <>
        <SwipeableDrawer
          anchor="bottom"
          disableSwipeToOpen
          open={openChangeVariantDrawer}
          onClose={handleCloseChangeVariantDrawer}
          sx={{
            "& .MuiPaper-root": {
              background: "#19212c",
              borderRadius: 4,
              maxHeight: "75vh",
            },
          }}
        >
          <Box
            zIndex={1201}
            display="flex"
            justifyContent="center"
            sx={{
              position: "sticky",
              top: 0,
              left: "50%",
              backgroundColor: "#19212c",
            }}
          >
            <Box height="40px">
              <Puller id="puller-handle" />
            </Box>
          </Box>
          <Box px={2}>
            <Box display="flex">
              <Box
                component="img"
                width="40%"
                objectFit="cover"
                src={productDetail.images[getImageIndex()].original}
                borderRadius={2}
              />
              <Stack width="60%" ml={2} gap={1}>
                <Box sx={{ flexWrap: "wrap", display: "flex", gap: 1 }}>
                  {renderVariantChip(productDetail)}
                </Box>
                <Typography fontWeight="bold" variant="h6">
                  {"Rp" + formatPrice(getVariantPrice(productDetail, tempVariant))}
                </Typography>
              </Stack>
            </Box>
            <Divider sx={{ my: 2 }} />
            {productDetail.variantList.map((variant) => (
              <>
                <Typography
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                  variant="body2"
                >
                  {variant.name + ":"}
                </Typography>
                <Container display="flex" disableGutters>
                  {variant.variant.map((variantSelection) => (
                    <>
                      <Button
                        onClick={() =>
                          handleVariantButtonClick(
                            variant.name,
                            variantSelection.refId
                          )
                        }
                        variant="contained"
                        sx={{
                          backgroundColor:
                            tempVariant.find((e) => e.name === variant.name)
                              .refId === variantSelection.refId
                              ? "secondary.main"
                              : "#3e454e",
                          mb: 1,
                          mr: 1,
                          textTransform: "none",
                        }}
                      >
                        {variantSelection.name}
                      </Button>
                    </>
                  ))}
                </Container>
                <Box mb={1} />
              </>
            ))}
            <Box my={8} />
          </Box>
        </SwipeableDrawer>
        <Box
          width="100%"
          zIndex={1201}
          p={1}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            display: {
              xs: openChangeVariantDrawer ? "block" : "none",
              md: "none",
            },
            backgroundColor: "#19212c",
          }}
        >
          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "secondary.main",
              textTransform: "none",
              fontWeight: "bold",
            }}
            onClick={() => handleSaveProductVariant(storeProduct)}
          >
            Simpan
          </Button>
        </Box>
      </>
    );
  };

  const renderChangeVariantDialog = (productDetail, storeProduct) => {
    return (
      <BootstrapDialog
        open={openChangeVariantDialog}
        onClose={handleCloseChangeVariantDialog}
        closeAfterTransition
        sx={{
          background: isXs ? "#19212c" : "",
          "& .MuiPaper-root": {
            background: "#19212c",
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: "bold", m: 0, p: 2 }}
          id="customized-dialog-title"
        >
          Ganti Variasi Produk
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseChangeVariantDialog}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 12,
            color: theme.palette.grey[500],
          })}
        >
          <Close />
        </IconButton>
        <DialogContent dividers>
          <Stack direction={"row"} gap={2}>
            <Box
              component="img"
              width="240px"
              height="100%"
              objectFit="cover"
              src={productDetail.images[getImageIndex()].original}
              borderRadius={2}
            />
            <Box>
              {productDetail.variantList.map((variant) => (
                <>
                  <Typography
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                    variant="body2"
                  >
                    {variant.name + ":"}
                  </Typography>
                  <Container display="flex" disableGutters>
                    {variant.variant.map((variantSelection) => (
                      <>
                        <Button
                          onClick={() =>
                            handleVariantButtonClick(
                              variant.name,
                              variantSelection.refId
                            )
                          }
                          variant="contained"
                          sx={{
                            backgroundColor:
                              tempVariant.find((e) => e.name === variant.name)
                                .refId === variantSelection.refId
                                ? "secondary.main"
                                : "#3e454e",
                            mb: 1,
                            mr: 1,
                            textTransform: "none",
                          }}
                        >
                          {variantSelection.name}
                        </Button>
                      </>
                    ))}
                  </Container>
                  <Box mb={1} />
                </>
              ))}
            </Box>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1">Subtotal</Typography>
            <Typography variant="body1" fontWeight="bold">
              {"Rp" + formatPrice(getVariantPrice(productDetail, tempVariant))}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleSaveProductVariant(storeProduct)}
            variant="contained"
            color="secondary"
            sx={{ textTransform: "none" }}
          >
            Simpan
          </Button>
        </DialogActions>
      </BootstrapDialog>
    );
  };

  React.useEffect(() => {
    calculatePrice();
    checkIsAllNotChecked();
  }, [cartData]);

  return (
    <>
      {isXs ? (
        <MobileSimpleAppBar title="Keranjang" />
      ) : (
        <PrimarySearchAppBar nav="cart" />
      )}
      {openChangeVariantDialog &&
        renderChangeVariantDialog(selectedProduct, selectedCartProduct)}
      {openChangeVariantDrawer &&
        renderChangeVariantDrawer(selectedProduct, selectedCartProduct)}
      <Box
        sx={{
          pr: { xs: 1, sm: 4, md: "6%" },
          pl: { xs: 1, sm: 4, md: "6%" },
          mb: { xs: 10, sm: 10 },
          mt: 1,
        }}
      >
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Typography sx={{ fontWeight: "bold" }} variant="h4" mt={2}>
            Keranjang
          </Typography>
          <Box mb={2} />
        </Box>
        <Box sx={{ display: { xs: "none", sm: "block", md: "none" } }}>
          <Divider sx={{ my: 2 }} />
        </Box>
        <Grid container columnSpacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              border={isXs || isSm ? 0 : 1}
              borderColor="rgba(255,255,255,0.2)"
              borderRadius={isXs || isSm ? 0 : 2}
            >
              <FormGroup>
                <Box
                  borderBottom={1}
                  borderColor="rgba(255,255,255,0.2)"
                  p={2}
                  sx={{ display: { xs: "none", md: "block" } }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="all"
                        checked={isAllChecked}
                        onClick={() => handleCheckAllButton(!isAllChecked)}
                        sx={{
                          pt: 0,
                          pb: 0,
                          pl: 0,
                          ml: 2,
                          color: "#b2b2b2",
                          "&.Mui-checked": { color: "secondary.main" },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body1" fontWeight="bold">
                        {"Pilih Semua (" + totalItem + ")"}
                      </Typography>
                    }
                  />
                </Box>
                {cartData.map((s, i) => (
                  <>
                    {s.products.length !== 0 && (
                      <Box
                        border={isXs || isSm ? 1 : 0}
                        borderBottom={
                          isXs || isSm ? 1 : i === cartData.length - 1 ? 0 : 1
                        }
                        borderColor="rgba(255,255,255,0.2)"
                        p={2}
                        borderRadius={isXs || isSm ? 2 : 0}
                        my={isXs || isSm ? 1 : 0}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={s.checked}
                              onClick={() => handleStoreCheckButton(s.storeId)}
                              sx={{
                                pt: 0,
                                pb: 0,
                                pl: { xs: 1, md: 2 },
                                pr: 2,
                                color: "#b2b2b2",
                                "&.Mui-checked": { color: "secondary.main" },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body1" fontWeight="bold">
                              {s.storeName}
                            </Typography>
                          }
                        />
                        <Box mt={1} />
                        {s.products.map((sp, j) => {
                          const productDetail = products.filter(
                            (p) => p.id === sp.productId
                          )[0];
                          return (
                            <>
                              <Box display="flex">
                                <Box>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={sp.checked}
                                        onClick={() =>
                                          handleProductCheckButton(
                                            s.storeId,
                                            sp.id
                                          )
                                        }
                                        sx={{
                                          pt: 0,
                                          pb: 0,
                                          pl: { xs: 1, md: 2 },
                                          pr: 0,
                                          color: "#b2b2b2",
                                          "&.Mui-checked": {
                                            color: "secondary.main",
                                          },
                                        }}
                                      />
                                    }
                                  />
                                </Box>
                                <Box
                                  display="flex"
                                  justifyContent={{
                                    xs: "flex-start",
                                    md: "space-between",
                                  }}
                                  width="100%"
                                >
                                  <Box display="flex">
                                    <Box
                                      onClick={() => {
                                        navigate("/product/" + sp.productId);
                                        scrollToTop();
                                      }}
                                      borderRadius={2}
                                      component="img"
                                      sx={{
                                        width: {
                                          xs: "72px",
                                          sm: "96px",
                                          md: "128px",
                                        },
                                        height: {
                                          xs: "72px",
                                          sm: "96px",
                                          md: "128px",
                                        },
                                        objectFit: "cover",
                                        cursor: "pointer",
                                      }}
                                      src={productDetail.mainImage}
                                    />
                                    <Stack
                                      ml={2}
                                      gap={1}
                                      direction="column"
                                      maxWidth="100%"
                                    >
                                      <Typography>
                                        {productDetail.title}
                                      </Typography>
                                      <Box
                                        sx={{
                                          display: { xs: "block", md: "none" },
                                        }}
                                      >
                                        <Typography fontWeight="bold">
                                          {"Rp" +
                                            formatPrice(
                                              getVariantPrice(
                                                productDetail,
                                                sp.variants
                                              )
                                            )}
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          flexWrap: "wrap",
                                          display: "flex",
                                          gap: 1,
                                        }}
                                      >
                                        {sp.variants.map((v, idx) => {
                                          return (
                                            <Chip
                                              label={getSelectedVariant(
                                                productDetail,
                                                v
                                              )}
                                              sx={{
                                                size: { xs: "small", md: "" },
                                                backgroundColor: "#508bbeff",
                                              }}
                                              deleteIcon={<ExpandMore />}
                                              onDelete={() => {
                                                handleChangeVarian(
                                                  productDetail,
                                                  sp
                                                );
                                              }}
                                              onClick={() =>
                                                handleChangeVarian(
                                                  productDetail,
                                                  sp
                                                )
                                              }
                                            />
                                          );
                                        })}
                                      </Box>
                                      <Box
                                        display="flex"
                                        alignContent="center"
                                        mt={1}
                                        sx={{
                                          backgroundColor: "#db3b2fff",
                                          borderRadius: 8,
                                          px: 1.5,
                                          py: 1,
                                          width: "fit-content",
                                        }}
                                      >
                                        <AccessAlarm
                                          sx={{ width: 18, height: 18 }}
                                        />
                                        <Typography variant="body2" ml={0.5}>
                                          {"Berakhir: 2 Hari"}
                                        </Typography>
                                      </Box>
                                    </Stack>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: { xs: "none", md: "block" },
                                    }}
                                  >
                                    <Typography fontWeight="bold">
                                      {"Rp" +
                                        formatPrice(
                                          getVariantPrice(
                                            productDetail,
                                            sp.variants
                                          )
                                        )}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                              <Box mb={2} />
                              <Box display="flex" justifyContent="flex-end">
                                <Stack direction="row">
                                  <Button
                                    onClick={() =>
                                      handleDeleteItem(s.storeId, sp.id)
                                    }
                                  >
                                    <Delete style={{ color: "d1d1d1" }} />
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleDecrement(s.storeId, sp.id)
                                    }
                                    sx={{
                                      backgroundColor: "#3e454e",
                                      minWidth: 0,
                                    }}
                                  >
                                    <Remove style={{ color: "d1d1d1" }} />
                                  </Button>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      height: 36,
                                      width: 60,
                                    }}
                                  >
                                    <TextField
                                      value={sp.quantity}
                                      onChange={(e) =>
                                        handleQuantityInputChange(
                                          e,
                                          s.storeId,
                                          sp.id
                                        )
                                      }
                                      onBlur={(e) =>
                                        handleOnBlur(e, s.storeId, sp.id)
                                      }
                                      sx={{ input: { textAlign: "center" } }}
                                      variant="standard"
                                      slotProps={{
                                        input: {
                                          disableUnderline: true,
                                        },
                                      }}
                                    ></TextField>
                                  </Box>
                                  <Button
                                    onClick={() =>
                                      handleIncrement(s.storeId, sp.id)
                                    }
                                    sx={{
                                      backgroundColor: "#3e454e",
                                      minWidth: 0,
                                    }}
                                  >
                                    <Add style={{ color: "d1d1d1" }} />
                                  </Button>
                                </Stack>
                              </Box>
                              {j < s.products.length - 1 && (
                                <Divider sx={{ my: 2 }} />
                              )}
                            </>
                          );
                        })}
                      </Box>
                    )}
                  </>
                ))}
              </FormGroup>
            </Box>
          </Grid>
          <Grid size={{ xs: 0, md: 4 }}>
            <Box
              border={1}
              borderColor="rgba(255,255,255,0.2)"
              borderRadius={2}
              sx={{
                display: { xs: "none", md: "block" },
                position: "sticky",
                top: 76,
              }}
              p={2}
            >
              <Typography variant="body1" fontWeight="bold">
                Ringkasan Belanja
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" width="100%">
                <Typography variant="body1">Total</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {totalPrice === 0 ? "-" : "Rp" + formatPrice(totalPrice)}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Button
                disabled={isAllNotChecked}
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleBuyClick}
                sx={{ textTransform: "none" }}
              >
                Beli{countChecked() > 0 ? " (" + countChecked() + ")" : ""}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box
        width="100%"
        p={2}
        sx={{
          position: "fixed",
          bottom: 0,
          display: { xs: "block", md: "none" },
          backgroundColor: "#242c36",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          boxShadow: 4,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  value="all"
                  checked={isAllChecked}
                  onClick={() => handleCheckAllButton(!isAllChecked)}
                  sx={{
                    pt: 0,
                    pb: 0,
                    pl: 0,
                    ml: 2,
                    color: "#b2b2b2",
                    "&.Mui-checked": { color: "secondary.main" },
                  }}
                />
              }
              label={
                <Typography variant="body1" noWrap>
                  {"Semua"}
                </Typography>
              }
            />
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="body1" fontWeight="bold" mr={2}>
              {totalPrice === 0 ? "-" : "Rp" + formatPrice(totalPrice)}
            </Typography>
            <Button
              disabled={isAllNotChecked}
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleBuyClick}
              sx={{ textTransform: "none", whiteSpace: "nowrap" }}
            >
              Beli{countChecked() > 0 ? " (" + countChecked() + ")" : ""}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Cart;
