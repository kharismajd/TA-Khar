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
  Avatar,
  Backdrop,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  Drawer,
  AppBar,
  Toolbar,
  Chip,
  Modal,
  SwipeableDrawer,
} from "@mui/material";
import BottomNav from "../components/BottomNav";
import PrimarySearchAppBar from "../components/AppAppBar";
import products from "../products.json";
import { useNavigate, useParams } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./react-gallery.css";
import {
  AccessAlarm,
  Add,
  CheckCircle,
  Close,
  Remove,
  Star,
} from "@mui/icons-material";
import { deepOrange } from "@mui/material/colors";
import styled from "@emotion/styled";

const isNumbers = (str) => /^(\s*|\d+)$/.test(str);

function formatPrice(n) {
  return n.toFixed(0).replace(/./g, function (c, i, a) {
    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "." + c : c;
  });
}

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: "#e1e1e1",
  borderRadius: 3,
  top: 20,
  position: "absolute",
  left: "calc(50% - 15px)",
}));

function Product() {
  const { productId } = useParams();
  const product = products.filter((p) => p.id == productId)[0];

  var answer = [];
  if (product.type === "Interest Check") {
    for (const question of product.interestCheckQuestions) {
      if (question.type === "text") {
        answer.push("");
      } else if (question.type === "radio") {
        answer.push(question.options[0]);
      } else {
        var checkboxAnswer = {};
        for (const checkboxOpt of question.options) {
          checkboxAnswer[checkboxOpt] = false;
        }
        answer.push(checkboxAnswer);
      }
    }
  }

  const variantDictionary = new Map();
  const variantNames = product.variantList.map((p) => p.name);
  variantNames.forEach((name) => variantDictionary.set(name, 1));

  const imageGalleryRef = React.useRef(null);
  const navigate = useNavigate();

  const [quantity, setQuantity] = React.useState(1);
  const [variants, setVariants] = React.useState(variantDictionary);
  const [totalPrice, setTotalPrice] = React.useState(product.price);
  const [openSuccessBackdrop, setOpenSuccessBackdrop] = React.useState(false);
  const [successBackdropMessage, setSuccessBackdropMessage] =
    React.useState("");
  const [disableQuestions, setDisableQuestions] = React.useState(false);
  const [icQuestionDrawer, setIcQuestionDrawer] = React.useState(false);
  const [buyProductDrawer, setBuyProductDrawer] = React.useState(false);
  const [openImage, setOpenImage] = React.useState(false);
  const [image, setImage] = React.useState("false");
  const [icAnswerState, setIcAnswerState] = React.useState(answer);

  const handleCloseImage = () => {
    setOpenImage(false);
  };

  const toggleIcQuestionDrawer = (bool) => {
    setIcQuestionDrawer(bool);
  };

  const toggleBuyProductDrawer = (bool) => {
    setBuyProductDrawer(bool);
  };

  const handleAnswerChange = (idx, answer) => {
    const icAnswerStateCopy = [...icAnswerState];
    icAnswerStateCopy[idx] = answer;
    setIcAnswerState(icAnswerStateCopy);
  };

  const handleCheckboxAnswerChange = (idx, answerKey) => {
    const icAnswerStateCopy = [...icAnswerState];
    icAnswerStateCopy[idx][answerKey] = !icAnswerStateCopy[idx][answerKey];
    setIcAnswerState(icAnswerStateCopy);
  };

  const handleSubmitInterestCheck = () => {
    setDisableQuestions(true);
    toggleIcQuestionDrawer(false);
    handleOpenSuccessBackdrop("Jawaban telah terkirim");
  };

  const handleAddToCart = () => {
    handleOpenSuccessBackdrop("Ditambahkan ke keranjang");
    toggleBuyProductDrawer(false);
  };

  const handleOpenSuccessBackdrop = (text) => {
    setOpenSuccessBackdrop(true);
    setSuccessBackdropMessage(text);

    setTimeout(() => {
      handleCloseSuccessBackdrop();
    }, 1000);
  };

  const handleCloseSuccessBackdrop = () => {
    setOpenSuccessBackdrop(false);
  };

  const handleBuyProduct = () => {
    const variantIds = [];
    for (const key of variants.keys()) {
      variantIds.push(variants.get(key).toString());
    }
    navigate(
      "../checkout?" +
        "productIds=" +
        productId +
        "&variants=" +
        variantIds.join(",") +
        "&q=" +
        quantity
    );
  };

  const getImageIndex = () => {
    var refId = "";
    for (const key of variants.keys()) {
      refId = refId + variants.get(key).toString();
    }

    var found = false;
    var idx = 0;
    for (const images of product.images) {
      if (images.refId.includes(parseInt(refId))) {
        found = true;
        break;
      }
      idx = idx + 1;
    }

    return found ? idx : 0;
  };

  const handleImageRef = () => {
    const imageIdx = getImageIndex();
    imageGalleryRef.current.slideToIndex(imageIdx);
  };

  const handleVariantButtonClick = (name, value) => {
    setVariants(new Map(variants.set(name, value)));
    setTotalPrice(getVariantPrice() * quantity);
    handleImageRef();
  };

  const handleDecrement = () => {
    if (quantity >= 2) {
      setQuantity(quantity - 1);
      setTotalPrice(getVariantPrice() * (quantity - 1));
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
    setTotalPrice(getVariantPrice() * (quantity + 1));
  };

  const handleQuantityInputChange = (event) => {
    const { value } = event.target;
    if (isNumbers(value)) {
      setQuantity(value);
    }
    setTotalPrice(getVariantPrice() * value);
  };

  const handleOnBlur = (event) => {
    const { value } = event.target;
    if (value === "" || value === null || parseInt(value) === 0) {
      setQuantity(1);
      setTotalPrice(getVariantPrice() * 1);
    }
  };

  const getVariantPrice = () => {
    var price = product.price;
    for (const key of variants.keys()) {
      var pVariant = product.variantList.filter((v) => v.name === key)[0];
      var priceIncrement = pVariant.variant.filter(
        (v) => v.refId === variants.get(key)
      )[0].priceIncrease;
      price = price + priceIncrement;
    }
    return price;
  };

  const handleGalleryImageZoom = () => {
    setImage(
      product.images[imageGalleryRef.current.getCurrentIndex()].original
    );
    setOpenImage(true);
  };

  const handleImageZoom = (image) => {
    setImage(image);
    setOpenImage(true);
  };

  const renderIcQuestions = (icQuestion, index) => {
    return (
      <>
        <Typography variant="body1">
          {index + 1 + ". " + icQuestion.question}
        </Typography>
        {icQuestion.type === "radio" && (
          <>
            <FormControl>
              <RadioGroup
                row
                name={icQuestion.id.toString()}
                value={icAnswerState[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              >
                {icQuestion.options.map((option, idx) => (
                  <>
                    <FormControlLabel
                      disabled={disableQuestions || product.status === "ended"}
                      value={option}
                      control={
                        <Radio
                          sx={{
                            color: "#b2b2b2",
                            "&.Mui-checked": {
                              color: "secondary.main",
                            },
                          }}
                        />
                      }
                      label={option}
                    />
                  </>
                ))}
              </RadioGroup>
            </FormControl>
          </>
        )}
        {icQuestion.type === "checkbox" && (
          <>
            <FormGroup row>
              {icQuestion.options.map((option, idx) => (
                <>
                  <FormControlLabel
                    disabled={disableQuestions || product.status === "ended"}
                    value={option}
                    control={
                      <Checkbox
                        checked={icAnswerState[index][option]}
                        onChange={() =>
                          handleCheckboxAnswerChange(index, option)
                        }
                        sx={{
                          color: "#b2b2b2",
                          "&.Mui-checked": {
                            color: "secondary.main",
                          },
                        }}
                      />
                    }
                    label={option}
                  />
                </>
              ))}
            </FormGroup>
          </>
        )}
        {icQuestion.type === "text" && (
          <>
            <Box mb={2} />
            <TextField
              disabled={disableQuestions || product.status === "ended"}
              id={icQuestion.id}
              placeholder="Jawaban anda"
              label=""
              multiline
              fullWidth
              maxRows={4}
              value={icAnswerState[index]}
              onChange={(event) => {
                handleAnswerChange(index, event.target.value);
              }}
              sx={{
                fieldset: {
                  borderColor: "rgba(255,255,255,0.4)",
                  color: "rgba(255,255,255,0.4)",
                },
                ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "rgba(255,255,255,0.6)",
                  },
                ".MuiInputLabel-root": {
                  color: "#c1c1c1",
                },
              }}
            />
          </>
        )}
      </>
    );
  };

  const renderVariant = (product) => {
    return (
      <>
        <Modal
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          open={openImage}
          onClose={handleCloseImage}
          closeAfterTransition
        >
          <img
            outline="none"
            src={image}
            alt="asd"
            style={{ maxHeight: "90%", maxWidth: "90%" }}
          />
        </Modal>
        {product.variantList.map((variant) => (
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
                    disabled={product.status === "ended"}
                    onClick={() =>
                      handleVariantButtonClick(
                        variant.name,
                        variantSelection.refId
                      )
                    }
                    variant="contained"
                    sx={{
                      backgroundColor:
                        variants.get(variant.name) === variantSelection.refId
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
      </>
    );
  };

  const renderVariantChip = (product) => {
    return (
      <>
        {product.variantList.map((variant) => (
          <>
            {variant.variant.map((variantSelection) => (
              <>
                {variants.get(variant.name) === variantSelection.refId && (
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

  return (
    <>
      <PrimarySearchAppBar nav="home" withMenu />
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
            <Typography variant="h5">{successBackdropMessage}</Typography>
          </Box>
        </Stack>
      </Backdrop>
      <Box
        sx={{
          pr: { xs: 1, sm: 4, md: "6%" },
          pl: { xs: 1, sm: 4, md: "6%" },
          mb: { xs: 6, sm: 6 },
          mt: 1,
        }}
      >
        <Grid container columnSpacing={3}>
          <Grid size={{ xs: 12, md: product.type === "Group Buy" ? 9 : 8 }}>
            <ImageGallery
              slideDuration={100}
              items={product.images}
              showPlayButton={false}
              ref={imageGalleryRef}
              onClick={handleGalleryImageZoom}
              showFullscreenButton={false}
            />
            <Typography variant="h4" mt={2}>
              {product.title}
            </Typography>
            {product.type === "Interest Check" && (
              <Typography fontWeight="bold" variant="h5" mt={1}>
                {"Rp." + formatPrice(totalPrice)}
              </Typography>
            )}
            {product.type === "Group Buy" && (
              <Typography fontWeight="bold" variant="h5" mt={1}>
                {"Rp" + formatPrice(totalPrice)}
              </Typography>
            )}
            <Stack direction="row" gap={1}>
              <Box
                mt={1}
                sx={{
                  backgroundColor:
                    product.type === "Group Buy" ? "#00A329" : "#851db8ff",
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  {product.type}
                </Typography>
              </Box>
              <Box
                display="flex"
                alignContent="center"
                mt={1}
                sx={{
                  backgroundColor: "#db3b2fff",
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                }}
              >
                <AccessAlarm />
                <Typography variant="body1" fontWeight="bold" ml={0.5}>
                  {product.status === "ended"
                    ? "Telah Berakhir"
                    : "Berakhir: 2 Hari"}
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: {
                  xs: product.type === "Group Buy" ? "block" : "none",
                  sm: product.type === "Group Buy" ? "block" : "none",
                  md: "none",
                },
              }}
            >
              {renderVariant(product)}
              <Divider sx={{ my: 2 }} />
            </Box>
            <Stack direction="row" spacing={2}>
              <Stack direction="column" justifyContent={"center"}>
                <Avatar
                  sx={{ bgcolor: deepOrange[500], width: 50, height: 50 }}
                >
                  T
                </Avatar>
              </Stack>
              <Stack direction="column" justifyContent={"center"}>
                <Stack direction="column" gap={0}>
                  <Typography variant="body2">{product.storeName}</Typography>
                  <Stack alignItems="center" direction="row" gap={1}>
                    <Star />
                    <Typography variant="body2">
                      {product.storeRating +
                        " (" +
                        product.storeRatingCount +
                        ")"}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Typography sx={{ fontWeight: "bold" }} variant="h7" mt={2}>
              Detail Produk
            </Typography>
            <Box mt={2} />
            {product.description.map((desc) => (
              <>
                {(desc.image !== "" || desc.image !== null) && (
                  <>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box
                        component="img"
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          maxWidth: { xs: "100%", sm: "80%", md: "60%" },
                          maxHeight: { xs: "auto", sm: 400, md: 400 },
                          cursor: "pointer",
                        }}
                        src={desc.image}
                        onClick={() => handleImageZoom(desc.image)}
                      />
                    </Box>
                    <Box mt={2} />
                  </>
                )}
                <Typography variant="body1">{desc.description}</Typography>
                <Box mt={2} />
              </>
            ))}
          </Grid>
          <Grid size={{ xs: 0, md: product.type === "Group Buy" ? 3 : 4 }}>
            {product.type === "Group Buy" && (
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
                >
                  Atur Jumlah dan Variasi
                </Typography>
                <Divider sx={{ my: 2 }} />
                {renderVariant(product)}
                <Divider sx={{ my: 2 }} />
                <Stack direction="row">
                  <Button
                    disabled={product.status === "ended"}
                    onClick={handleDecrement}
                    sx={{ backgroundColor: "#3e454e", minWidth: 0 }}
                  >
                    <Remove style={{ color: "#d1d1d1" }} />
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
                      value={quantity}
                      onChange={handleQuantityInputChange}
                      onBlur={handleOnBlur}
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
                    disabled={product.status === "ended"}
                    onClick={handleIncrement}
                    sx={{ backgroundColor: "#3e454e", minWidth: 0 }}
                  >
                    <Add style={{ color: "#d1d1d1" }} />
                  </Button>
                </Stack>
                <Box mb={2} />
                <Grid container>
                  <Grid size={6}>
                    <Typography variant="body1">Subtotal</Typography>
                  </Grid>
                  <Grid size={6}>
                    <Box display="flex" justifyContent="flex-end">
                      <Typography
                        gutterBottom
                        sx={{ fontWeight: "bold" }}
                        variant="body1"
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
                      disabled={product.status === "ended"}
                      fullWidth
                      variant="outlined"
                      sx={{
                        borderColor: "secondary.main",
                        textTransform: "none",
                        color: "secondary.main",
                        fontWeight: "bold",
                      }}
                      onClick={handleBuyProduct}
                    >
                      Beli
                    </Button>
                  </Grid>
                  <Grid size={6}>
                    <Button
                      disabled={product.status === "ended"}
                      fullWidth
                      variant="contained"
                      sx={{
                        backgroundColor: "secondary.main",
                        textTransform: "none",
                        fontWeight: "bold",
                      }}
                      onClick={handleAddToCart}
                    >
                      + Keranjang
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
            {product.type === "Interest Check" && (
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
                  Interest Check
                </Typography>
                <Divider sx={{ my: 2 }} />
                {product.interestCheckQuestions.map((icQuestion, index) => (
                  <>
                    {renderIcQuestions(icQuestion, index)}
                    <Divider sx={{ my: 2 }} />
                  </>
                ))}
                <Button
                  fullWidth
                  disabled={disableQuestions || product.status === "ended"}
                  variant="contained"
                  color="secondary"
                  sx={{
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                  onClick={handleSubmitInterestCheck}
                >
                  Submit
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
      <Box
        width="100%"
        p={1}
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
        {product.type === "Interest Check" && (
          <Box display="flex">
            <Button
              disabled={disableQuestions || product.status === "ended"}
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => toggleIcQuestionDrawer(true)}
              sx={{ textTransform: "none", whiteSpace: "nowrap" }}
            >
              Isi Interest Check
            </Button>
          </Box>
        )}
        {product.type === "Group Buy" && (
          <Grid container spacing={1}>
            <Grid size={6}>
              <Button
                disabled={product.status === "ended"}
                fullWidth
                variant="outlined"
                sx={{
                  borderColor: "secondary.main",
                  textTransform: "none",
                  color: "secondary.main",
                  fontWeight: "bold",
                }}
                onClick={() => toggleBuyProductDrawer(true)}
              >
                Beli
              </Button>
            </Grid>
            <Grid size={6}>
              <Button
                disabled={product.status === "ended"}
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "secondary.main",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
                onClick={() => toggleBuyProductDrawer(true)}
              >
                + Keranjang
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
      {product.type === "Interest Check" && (
        <SwipeableDrawer
          disableSwipeToOpen
          anchor="bottom"
          open={icQuestionDrawer}
          onClose={() => toggleIcQuestionDrawer(false)}
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
            {product.interestCheckQuestions.map((icQuestion, index) => (
              <>
                {renderIcQuestions(icQuestion, index)}
                {index < product.interestCheckQuestions.length - 1 ? (
                  <>
                    <Divider sx={{ my: 2 }} />
                  </>
                ) : (
                  <Box my={8} />
                )}
              </>
            ))}
          </Box>
        </SwipeableDrawer>
      )}
      {product.type === "Group Buy" && (
        <SwipeableDrawer
          anchor="bottom"
          disableSwipeToOpen
          open={buyProductDrawer}
          onClose={() => toggleBuyProductDrawer(false)}
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
                src={product.images[getImageIndex()].original}
                borderRadius={2}
              />
              <Stack width="60%" ml={2} gap={1}>
                <Box sx={{ flexWrap: "wrap", display: "flex", gap: 1 }}>
                  {renderVariantChip(product)}
                </Box>
                <Typography fontWeight="bold" variant="h6">
                  {"Rp" + formatPrice(totalPrice)}
                </Typography>
                <Box display="flex" mt={2}>
                  <Button
                    disabled={product.status === "ended"}
                    onClick={handleDecrement}
                    sx={{ backgroundColor: "#3e454e", minWidth: 0 }}
                  >
                    <Remove fontSize="small" style={{ color: "#d1d1d1" }} />
                  </Button>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 36,
                      width: 48,
                    }}
                  >
                    <TextField
                      value={quantity}
                      onChange={handleQuantityInputChange}
                      onBlur={handleOnBlur}
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
                    disabled={product.status === "ended"}
                    onClick={handleIncrement}
                    sx={{ backgroundColor: "#3e454e", minWidth: 0 }}
                  >
                    <Add fontSize="small" style={{ color: "#d1d1d1" }} />
                  </Button>
                </Box>
              </Stack>
            </Box>
            <Divider sx={{ my: 2 }} />
            {renderVariant(product)}
            <Box my={8} />
          </Box>
        </SwipeableDrawer>
      )}
      <Box
        width="100%"
        zIndex={1201}
        p={1}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          display: { xs: icQuestionDrawer ? "block" : "none", md: "none" },
          backgroundColor: "#19212c",
        }}
      >
        <Box display="flex">
          <Button
            disabled={disableQuestions || product.status === "ended"}
            fontWeight="bold"
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleSubmitInterestCheck}
            sx={{ textTransform: "none", whiteSpace: "nowrap" }}
          >
            Submit
          </Button>
        </Box>
      </Box>
      <Box
        width="100%"
        zIndex={1201}
        p={1}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          display: { xs: buyProductDrawer ? "block" : "none", md: "none" },
          backgroundColor: "#19212c",
        }}
      >
        <Grid container spacing={1}>
          <Grid size={6}>
            <Button
              disabled={product.status === "ended"}
              fullWidth
              variant="outlined"
              sx={{
                borderColor: "secondary.main",
                textTransform: "none",
                color: "secondary.main",
                fontWeight: "bold",
              }}
              onClick={handleBuyProduct}
            >
              Beli
            </Button>
          </Grid>
          <Grid size={6}>
            <Button
              disabled={product.status === "ended"}
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "secondary.main",
                textTransform: "none",
                fontWeight: "bold",
              }}
              onClick={handleAddToCart}
            >
              + Keranjang
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Product;
