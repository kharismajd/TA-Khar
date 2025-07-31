import React from "react";
import {
  Typography,
  Box,
  Grid,
  Divider,
  Stack,
  Button,
  Container,
  IconButton,
  TextField,
} from "@mui/material";
import BottomNav from "../components/BottomNav";
import PrimarySearchAppBar from "../components/AppAppBar";
import products from "../products.json";
import { useParams } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./react-gallery.css";
import { Add, Remove } from "@mui/icons-material";

const isNumbers = (str) => /^(\s*|\d+)$/.test(str)

function formatPrice(n) {
  return n.toFixed(0).replace(/./g, function (c, i, a) {
    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "." + c : c;
  });
}

function Product() {
  const { productId } = useParams();
  const product = products.filter((p) => p.id == productId)[0];

  const variantDictionary = new Map();
  const variantNames = product.variantList.map((p) => p.name)
  variantNames.forEach((name) => variantDictionary.set(name, 1))

  const imageGalleryRef = React.useRef(null);

  const [quantity, setQuantity] = React.useState(1);
  const [variants, setVariants] = React.useState(variantDictionary)
  const [totalPrice, setTotalPrice] = React.useState(product.price)

  const handleImageRef = () => {
    var refId = ""
    for (const key of variants.keys()) {
      refId = refId + variants.get(key).toString()
    }

    var found = false
    var idx = 0
    for (const images of product.images) {
      if (images.refId.includes(parseInt(refId))) {
        found = true
        break
      }
      idx = idx + 1
    }

    imageGalleryRef.current.slideToIndex(found ? idx : 0)
  }

  const handleVariantButtonClick = (name, value) => {
    setVariants(new Map(variants.set(name, value)))
    setTotalPrice(getVariantPrice() * quantity)
    handleImageRef()
  }

  const handleDecrement = () => {
    if (quantity >= 2) {
      setQuantity(quantity - 1);
      setTotalPrice(getVariantPrice() * (quantity - 1))
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
    setTotalPrice(getVariantPrice() * (quantity + 1))
  };

  const handleQuantityInputChange = (event) => {
    const { value } = event.target;
    if (isNumbers(value)) {
      setQuantity(value);
    }
    setTotalPrice(getVariantPrice() * value)
  }

  const handleOnBlur = (event) => {
    const { value } = event.target;
    if (value === "" || value === null) {
      setQuantity(1)
      setTotalPrice(getVariantPrice() * 1)
    }
  }

  const getVariantPrice = () => {
    var price = product.price
    for (const key of variants.keys()) {
      var pVariant = product.variantList.filter((v) => v.name === key)[0]
      var priceIncrement = pVariant.variant.filter((v) => v.refId === variants.get(key))[0].priceIncrease
      price = price + priceIncrement
    }
    return price
  }

  return (
    <>
      <PrimarySearchAppBar nav="home" />
      <Box
        sx={{
          pr: { xs: 1, sm: 4, md: "6%" },
          pl: { xs: 1, sm: 4, md: "6%" },
          mb: { xs: 10, sm: 4 },
          mt: 1.5,
        }}
      >
        <Grid container columnSpacing={2}>
          <Grid size={{ xs: 12, md: 9 }}>
            <ImageGallery items={product.images} showPlayButton={false} ref={imageGalleryRef} />
          </Grid>
          <Grid size={{ xs: 0, md: 3 }}>
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
              <Box mb={1} />
              <Typography
                gutterBottom
                sx={{ fontWeight: "bold" }}
                variant="body1"
                noWrap={true}
              >
                Atur Jumlah dan Variasi
              </Typography>
              <Box mt={2} />
              <Divider />
              <Box mb={2} />
              {product.variantList.map((variant) => (
                <>
                  <Typography
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                    variant="body2"
                    noWrap={true}
                  >
                    {variant.name + ":"}
                  </Typography>
                  <Container display="flex" disableGutters>
                    {variant.variant.map((variantSelection) => (
                      <>
                        <Button
                          onClick={() => handleVariantButtonClick(variant.name, variantSelection.refId)}
                          variant="contained"
                          sx={{
                            backgroundColor: variants.get(variant.name) === variantSelection.refId ? "secondary.main" : "#2f2f2f",
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
              <Box mb={2} />
              <Divider />
              <Box mb={2} />
              <Stack direction="row">
                <Button
                  onClick={handleDecrement}
                  sx={{ backgroundColor: "#2f2f2f", minWidth: 0 }}
                >
                  <Remove style={{ color: "white" }}/>
                </Button>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 36,
                    width: 60
                  }}
                >
                  <TextField value={quantity} onChange={handleQuantityInputChange} onBlur={handleOnBlur} sx={{ input: { textAlign: "center" } }}></TextField>
                </Box>
                <Button
                  onClick={handleIncrement}
                  sx={{ backgroundColor: "#2f2f2f", minWidth: 0 }}
                >
                  <Add style={{ color: "white" }}/>
                </Button>
              </Stack>
              <Box mb={2} />
              <Grid container>
                <Grid size={6}>
                <Typography
                    variant="body1"
                    noWrap={true}
                  >
                    Subtotal
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Box display="flex" justifyContent="flex-end">
                    <Typography
                        gutterBottom
                        sx={{ fontWeight: "bold" }}
                        variant="body1"
                        noWrap={true}
                      >
                        {"Rp" + formatPrice(totalPrice)}
                      </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box mb={1} />    
              <Grid container spacing={1}>
                <Grid size={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: "secondary.main",
                      textTransform: "none",
                    }}
                  >
                      Beli
                  </Button>
                </Grid>   
                <Grid size={6}>
                <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: "secondary.main",
                      textTransform: "none",
                    }}
                  >
                      + Keranjang
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <BottomNav value={0} />
        </Box>
      </Box>
    </>
  );
}

export default Product;
