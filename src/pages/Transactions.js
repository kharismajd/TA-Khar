import React, { useReducer } from "react";
import {
  Typography,
  Box,
  FormControl,
  InputAdornment,
  TextField,
  Stack,
  Button,
  Container,
  Divider,
  Grid,
  Pagination,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
  Dialog,
  LinearProgress,
  linearProgressClasses,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Modal,
  Fade,
} from "@mui/material";
import { red } from "@mui/material/colors";
import dayjs from "dayjs";
import BottomNav from "../components/BottomNav";
import PrimarySearchAppBar from "../components/AppAppBar";
import { Search, ShoppingBag } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import transactions from "../transaction.json";
import products from "../products.json";
import { useSearchParams, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import useMediaQuery from "@mui/material/useMediaQuery";
import MobileTransactionAppBar from "../components/MobileTransactionAppBar";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 25,
  borderRadius: 25,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#d1d1d1",
    ...theme.applyStyles("dark", {
      backgroundColor: "#d1d1d1",
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#00A329",
    ...theme.applyStyles("dark", {
      backgroundColor: "#00A329",
    }),
  },
}));

function formatPrice(n) {
  return n.toFixed(0).replace(/./g, function (c, i, a) {
    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "." + c : c;
  });
}

function getVariantPrice(transactionItem) {
  const ItemId = transactionItem.item.itemId;
  const product = products.find((p) => {
    return p.id === ItemId;
  });

  var price = product.price;
  if (
    transactionItem.item.variants === null ||
    transactionItem.item.variants.length === 0
  ) {
    return price;
  }

  transactionItem.item.variants.forEach((tv) => {
    product.variantList.forEach((v) => {
      if (tv.name === v.name) {
        v.variant.forEach((vv) => {
          if (tv.refId === vv.refId) {
            price = price + vv.priceIncrease;
          }
        });
      }
    });
  });

  return price;
}

function checkStatus(transactionItem) {
  if (
    transactionItem.shippingStatus !== null &&
    transactionItem.shippingStatus === "shipped"
  ) {
    return "Selesai";
  }

  if (
    transactionItem.shippingStatus !== null &&
    transactionItem.shippingStatus === "shipping"
  ) {
    return "Dikirim";
  }

  const ItemId = transactionItem.item.itemId;
  const product = products.find((p) => {
    return p.id === ItemId;
  });

  if (product === null) {
    return "";
  }

  if (product.status === "ongoing") {
    return "GB Ongoing";
  }

  if (
    product.status === "ended" &&
    !product.isInProduction &&
    product.isFailed
  ) {
    return "Gagal";
  }

  if (
    product.status === "ended" &&
    product.isInProduction &&
    !product.isFailed
  ) {
    return "Diproduksi";
  }

  return "";
}

function statusColor(status) {
  if (status === "Gagal") {
    return { text: "#f44336", background: "#FFA9A6" };
  }

  if (
    status === "Diproduksi" ||
    status === "GB Ongoing" ||
    status === "Dikirim"
  ) {
    return { text: "#8AA300", background: "#FFFC9E" };
  }

  return { text: "#00A329", background: "#9EFFA1" };
}

function checkStringBoolean(string) {
  if (string === null || string === "") {
    return true; //default value
  }

  return string === "true" ? true : false;
}

function checkNullString(any, defaultReturn) {
  return any === null ? defaultReturn : any;
}

function checkNull(any, defaultReturn) {
  return any === null || isNaN(any) ? defaultReturn : any;
}

function setDate(date) {
  return date === null || date === "" || isNaN(parseInt(date))
    ? null
    : dayjs(parseInt(date));
}

Date.prototype.toShortFormat = function () {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const day = this.getDate();

  const monthIndex = this.getMonth();
  const monthName = monthNames[monthIndex];

  const year = this.getFullYear();

  return `${day} ${monthName} ${year}`;
};

Date.prototype.toShortFormatWithHours = function () {
  const hours = String(this.getHours()).padStart(2, "0");
  const minutes = String(this.getMinutes()).padStart(2, "0");

  return this.toShortFormat() + `, ${hours}:${minutes}`;
};

Date.prototype.toShortFormatWithDay = function () {
  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const dayIndex = this.getDay();
  const dayName = dayNames[dayIndex];

  return `${dayName}, ${this.toShortFormat()}`;
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function Transactions() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [openImage, setOpenImage] = React.useState(false);
  const [image, setImage] = React.useState("false");

  let startDate = setDate(searchParams.get("startDate"));
  let endDate = setDate(searchParams.get("endDate"));

  let transactionSearchInputValue = checkNullString(
    searchParams.get("transactionTerm"),
    ""
  );
  let status = checkNullString(searchParams.get("status"), "semua");
  let page = checkNull(parseInt(searchParams.get("transactionPage")), 1);
  let transactionDetailDialog = checkNull(
    parseInt(searchParams.get("transactionDetailStep")),
    0
  );
  let transactionId = checkNull(
    parseInt(searchParams.get("transactionId")),
    null
  );
  let productionInfoId = checkNull(
    parseInt(searchParams.get("productionInfoId")),
    null
  );

  let selectedTransaction = null;
  let product = null;
  if (transactionId !== null) {
    selectedTransaction = transactions.find((t) => {
      return t.id === transactionId;
    });
    product = products.find((p) => {
      return p.id === selectedTransaction.item.itemId;
    });
  }

  const isXs = useMediaQuery((theme) => theme.breakpoints.only("xs"));
  const navigate = useNavigate();
  let itemsPerPage = 10;

  const handleCloseImage = () => {
    setOpenImage(false);
  };

  const handleImage = (value) => {
    setImage(value);
    setOpenImage(true);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleTransactionDetailDialogOpen = (transaction) => {
    transactionId = transaction.id;
    applyFilter(
      transactionSearchInputValue,
      status,
      startDate,
      endDate,
      page,
      1,
      transactionId,
      productionInfoId
    );
  };

  const handleTransactionDetailDialogClose = () => {
    if (transactionDetailDialog === 3 && !isXs) {
      transactionDetailDialog = 2;
    }
    if (transactionDetailDialog === 3 && isXs) {
      productionInfoId = 0;
    }
    if (transactionDetailDialog === 2) {
      productionInfoId = null;
    }
    if (transactionDetailDialog === 1) {
      transactionId = null;
    }
    applyFilter(
      transactionSearchInputValue,
      status,
      startDate,
      endDate,
      page,
      transactionDetailDialog - 1,
      transactionId,
      productionInfoId
    );
  };

  const handleProductionInfoDialogOpen = () => {
    applyFilter(
      transactionSearchInputValue,
      status,
      startDate,
      endDate,
      page,
      2,
      transactionId,
      0
    );
  };

  const handleProductionInfoIdChange = (id) => {
    productionInfoId = id;
    applyFilter(
      transactionSearchInputValue,
      status,
      startDate,
      endDate,
      page,
      isXs ? 3 : 2,
      transactionId,
      productionInfoId
    );
  };

  const handleProductionInfoDialogClose = () => {
    productionInfoId = null;
    applyFilter(
      transactionSearchInputValue,
      status,
      startDate,
      endDate,
      page,
      1,
      transactionId,
      productionInfoId
    );
  };

  const handleInputChange = (event) => {
    transactionSearchInputValue = event.target.value;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      applyFilter(
        transactionSearchInputValue,
        status,
        startDate === null ? null : startDate.valueOf(),
        endDate === null ? null : endDate.valueOf(),
        page,
        0,
        null,
        null
      );
      scrollToTop();
    }
  };

  const handleStartDateChange = (value) => {
    startDate = value;
    applyFilter(
      transactionSearchInputValue,
      status,
      startDate,
      endDate,
      page,
      0,
      null,
      null
    );
  };

  const handleEndDateChange = (value) => {
    endDate = value;
    applyFilter(
      transactionSearchInputValue,
      status,
      startDate,
      endDate,
      page,
      0,
      null,
      null
    );
  };

  const handlePageChange = (event, value) => {
    page = value;
    applyFilter(
      transactionSearchInputValue,
      status,
      startDate,
      endDate,
      page,
      0,
      null,
      null
    );
  };

  const handleStatusChange = (event) => {
    status = event.target.value;
    applyFilter(
      transactionSearchInputValue,
      status,
      startDate,
      endDate,
      page,
      0,
      null,
      null
    );
  };

  const applyFilter = (
    transactionSearchInputValue,
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
        transactionSearchInputValue +
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

  const handleResetButton = () => {
    transactionSearchInputValue = "";
    startDate = null;
    endDate = null;
    status = "semua";
    page = 1;
    transactionDetailDialog = 0;
    transactionId = null;
    productionInfoId = null;
    applyFilter(
      "",
      status,
      null,
      null,
      page,
      transactionDetailDialog,
      transactionId,
      productionInfoId
    );
    scrollToTop();
  };

  const filterTransactions = (
    term,
    status,
    startDate,
    endDate,
    page,
    itemsPerPage
  ) => {
    const startDay =
      startDate !== null
        ? dayjs(startDate)
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .set("millisecond", 0)
        : null;
    const endDay =
      endDate !== null
        ? dayjs(endDate)
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .set("millisecond", 0)
        : null;
    const filteredTransactions = [];

    transactions.forEach((t) => {
      var tStatus = checkStatus(t);
      const ItemId = t.item.itemId;
      const product = products.find((p) => {
        return p.id === ItemId;
      });

      const cleanedTStatus = tStatus.replaceAll(" ", "").toLowerCase();
      const cleanedStatus = status.replaceAll(" ", "").toLowerCase();
      if (
        product.title.toLowerCase().includes(term.toLowerCase()) &&
        (cleanedStatus === cleanedTStatus || cleanedStatus === "semua")
      ) {
        const day = dayjs(t.createdAt)
          .set("hour", 0)
          .set("minute", 0)
          .set("second", 0)
          .set("millisecond", 0);

        if (
          (startDay === null && endDay === null) ||
          (startDay === null && (day.isBefore(endDay) || day.isSame(endDay))) ||
          (endDay === null &&
            (day.isAfter(startDay) || day.isSame(startDay))) ||
          ((day.isAfter(startDay) || day.isSame(startDay)) &&
            (day.isBefore(endDay) || day.isSame(endDay)))
        ) {
          filteredTransactions.push(t);
        }
      }
    });

    filteredTransactions.sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );

    return {
      items: filteredTransactions.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
      ),
      total: filteredTransactions.length,
    };
  };

  const filteredTransactions = filterTransactions(
    transactionSearchInputValue,
    status,
    startDate,
    endDate,
    page,
    itemsPerPage
  );
  const pageTotal = Math.ceil(filteredTransactions.total / itemsPerPage);

  return (
    <>
      <Modal
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
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
      {transactionId !== null && product !== null && (
        // Transaction Detail Dialog
        <BootstrapDialog
          onClose={handleTransactionDetailDialogClose}
          aria-labelledby="customized-dialog-title"
          open={transactionDetailDialog !== 0}
          sx={{
            background: isXs ? "#09090B" : "",
            "& .MuiPaper-root": {
              background: isXs ? "#09090B" : "",
            },
          }}
          slotProps={{
            paper: {
              sx: {
                maxHeight: isXs ? "100%" : "80vh",
                backgroundColor: !isXs ? "#09090B" : "",
              },
            },
          }}
          maxWidth={
            transactionDetailDialog == 1 || transactionDetailDialog == 0
              ? "sm"
              : "md"
          }
          fullWidth
          fullScreen={isXs}
          key={transactionDetailDialog}
          transitionDuration={0}
        >
          <DialogTitle
            sx={{ fontWeight: "bold", m: 0, p: 2 }}
            id="customized-dialog-title"
          >
            {transactionDetailDialog >= 2
              ? "Info Produksi"
              : "Detail Transaksi"}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleTransactionDetailDialogClose}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            {transactionDetailDialog === 1 && (
              //Transaction Detail
              <>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Pesanan {checkStatus(selectedTransaction)}
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1">Tanggal Pembelian</Typography>
                  <Typography variant="body1" justifySelf="flex-end">
                    {new Date(
                      selectedTransaction.createdAt
                    ).toShortFormatWithHours()}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2, mt: 2 }} />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Detail Produk
                  </Typography>
                  <Typography
                    variant="body1"
                    justifySelf="flex-end"
                    gutterBottom
                  >
                    {product.storeName + " >"}
                  </Typography>
                </Box>
                <Stack
                  direction="row"
                  spacing={2}
                  onClick={() => {
                    navigate("/product/" + product.id);
                    scrollToTop();
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  <Box
                    borderRadius={2}
                    component="img"
                    sx={{
                      width: 64,
                      height: 64,
                      objectFit: "cover",
                    }}
                    src={product.mainImage}
                  />
                  <Stack gap={0.75}>
                    <Typography variant="body1" fontWeight="bold">
                      {product.title}
                    </Typography>
                    <Typography variant="body1">
                      {selectedTransaction.item.quantity +
                        " x Rp" +
                        formatPrice(getVariantPrice(selectedTransaction))}
                    </Typography>
                  </Stack>
                </Stack>
                <Divider sx={{ mb: 2, mt: 3 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Info Pengiriman
                </Typography>
                <Grid container rowSpacing={1}>
                  <Grid size={5}>
                    <Typography variant="body1">Kurir</Typography>
                  </Grid>
                  <Grid size={7}>
                    <Typography variant="body1">Kurir A</Typography>
                  </Grid>
                  <Grid size={5}>
                    <Typography variant="body1">Resi</Typography>
                  </Grid>
                  <Grid size={7}>
                    <Typography variant="body1">RESI12345RESI</Typography>
                  </Grid>
                  <Grid size={5}>
                    <Typography variant="body1">Alamat</Typography>
                  </Grid>
                  <Grid size={7}>
                    <Typography variant="body1">Mr Pikachu</Typography>
                    <Typography variant="body1">+62 1234567890</Typography>
                    <Typography variant="body1">
                      Jl. Pikachu No. 123, Kec. Pikachu, Kota Pikachu, Prov.
                      Pikachu
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ mb: 2, mt: 2 }} />
                {product.productionInfo &&
                  product.productionInfo.length > 0 && (
                    <>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Info Produksi
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="secondary.main"
                          justifySelf="flex-end"
                          sx={{ cursor: "pointer" }}
                          onClick={handleProductionInfoDialogOpen}
                        >
                          Lihat Detail
                        </Typography>
                      </Box>
                      <Typography variant="body1" gutterBottom>
                        {new Date(
                          product.productionInfo[0].createdAt
                        ).toShortFormatWithDay()}
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {product.productionInfo[0].description}
                      </Typography>
                      <Box mt={1.5} />
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ width: "calc(100% - 35px)", mr: 1 }}>
                          <BorderLinearProgress
                            variant="determinate"
                            value={product.productionInfo[0].progress}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                          >{`${Math.round(
                            product.productionInfo[0].progress
                          )}%`}</Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2, mt: 3 }} />
                    </>
                  )}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Rincian Pembayaran
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body1">Metode Pembayaran</Typography>
                  <Typography variant="body1" justifySelf="flex-end">
                    {selectedTransaction.paymentMethod}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 1 }} />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body1">Subtotal Harga Barang</Typography>
                  <Typography variant="body1" justifySelf="flex-end">
                    Rp
                    {formatPrice(
                      getVariantPrice(selectedTransaction) *
                        selectedTransaction.item.quantity
                    )}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body1">Total Ongkos Kirim</Typography>
                  <Typography variant="body1" justifySelf="flex-end">
                    Rp{formatPrice(0)}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 1 }} />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1" fontWeight="bold">
                    Total Belanja
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    justifySelf="flex-end"
                  >
                    Rp
                    {formatPrice(
                      getVariantPrice(selectedTransaction) *
                        selectedTransaction.item.quantity
                    )}
                  </Typography>
                </Box>
                {isXs && <Box sx={{ height: "60px" }} />}
              </>
            )}
            {!isXs && transactionDetailDialog >= 2 && (
              // Production Info Desktop
              <>
                <Grid container spacing={2}>
                  <Grid item size={{ xs: 0, sm: 7.5 }}>
                    <Box
                      sx={{
                        height: "calc(70vh - 32px)",
                        overflowY: "auto",
                        borderRight: "1px solid rgba(255,255,255,0.2)",
                        borderWidth: "1px",
                        pr: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Box sx={{ width: "calc(100% - 35px)", mr: 1 }}>
                          <BorderLinearProgress
                            variant="determinate"
                            value={
                              product.productionInfo[productionInfoId].progress
                            }
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                          >{`${Math.round(
                            product.productionInfo[productionInfoId].progress
                          )}%`}</Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2, mt: 2 }} />
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        {new Date(
                          product.productionInfo[productionInfoId].createdAt
                        ).toShortFormatWithDay()}
                      </Typography>
                      <Box mb={2} />
                      <Typography
                        variant="body1"
                        sx={{ whiteSpace: "pre-line" }}
                      >
                        {product.productionInfo[productionInfoId].description}
                      </Typography>
                      {product.productionInfo[productionInfoId].images &&
                        product.productionInfo[productionInfoId].images.length >
                          0 && (
                          <Box mt={2}>
                            <Grid container spacing={1}>
                              {product.productionInfo[
                                productionInfoId
                              ].images.map((image, imgIndex) => (
                                <Grid item size={4} key={imgIndex}>
                                  <Box
                                    onClick={() => handleImage(image.original)}
                                    borderRadius={2}
                                    component="img"
                                    sx={{
                                      width: "100%",
                                      objectFit: "cover",
                                      ":hover": {
                                        cursor: "pointer",
                                      },
                                    }}
                                    src={image.original}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}
                    </Box>
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 4.5 }}>
                    <Box
                      sx={{
                        maxHeight: "calc(70vh - 32px)",
                        overflowY: "auto",
                      }}
                    >
                      <Stepper
                        activeStep={productionInfoId}
                        orientation="vertical"
                        nonLinear
                      >
                        {product.productionInfo.map((step, index) => (
                          <Step
                            key={new Date(
                              step.createdAt
                            ).toShortFormatWithDay()}
                            expanded
                            sx={{
                              "& .MuiStepLabel-root .MuiStepIcon-text": {
                                fill: "rgba(255,255,255,0)", // circle color (COMPLETED)
                              },
                              "& .MuiStepLabel-root .Mui-active": {
                                color: "#00A329", // circle color (ACTIVE)
                              },
                              "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text":
                                {
                                  fill: "rgba(255,255,255,0)", // circle's number (ACTIVE)
                                },
                            }}
                          >
                            <StepLabel icon={null} sx={{ fontWeight: "bold" }}>
                              <Typography variant="body1" fontWeight="bold">
                                {new Date(
                                  step.createdAt
                                ).toShortFormatWithDay()}
                              </Typography>
                            </StepLabel>
                            <StepContent>
                              <Typography
                                variant="body1"
                                gutterBottom
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: "3",
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {step.description}
                              </Typography>
                              {step.images && step.images.length > 0 && (
                                <Box mt={1} mb={1}>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ overflowX: "auto" }}
                                  >
                                    {step.images.map((image, imgIndex) => (
                                      <Box
                                        onClick={() =>
                                          handleImage(image.original)
                                        }
                                        key={imgIndex}
                                        borderRadius={2}
                                        component="img"
                                        sx={{
                                          width: 64,
                                          height: 64,
                                          objectFit: "cover",
                                          ":hover": {
                                            cursor: "pointer",
                                          },
                                        }}
                                        src={image.original}
                                      />
                                    ))}
                                  </Stack>
                                </Box>
                              )}
                              {productionInfoId !== index && (
                                <>
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    color="secondary.main"
                                    sx={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleProductionInfoIdChange(index)
                                    }
                                    fontWeight="bold"
                                  >
                                    Lihat Detail
                                  </Typography>
                                </>
                              )}
                            </StepContent>
                          </Step>
                        ))}
                      </Stepper>
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
            {isXs && transactionDetailDialog === 2 && (
              // Production Info Mobile
              <>
                <Stepper activeStep={0} orientation="vertical" nonLinear>
                  {product.productionInfo.map((step, index) => (
                    <Step
                      key={new Date(step.createdAt).toShortFormatWithDay()}
                      expanded
                      sx={{
                        "& .MuiStepLabel-root .MuiStepIcon-text": {
                          fill: "rgba(255,255,255,0)", // circle color (COMPLETED)
                        },
                        "& .MuiStepLabel-root .Mui-active": {
                          color: "#00A329", // circle color (ACTIVE)
                        },
                        "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text": {
                          fill: "rgba(255,255,255,0)", // circle's number (ACTIVE)
                        },
                      }}
                    >
                      <StepLabel icon={null} sx={{ fontWeight: "bold" }}>
                        <Typography variant="body1" fontWeight="bold">
                          {new Date(step.createdAt).toShortFormatWithDay()}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography
                          variant="body1"
                          gutterBottom
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "3",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {step.description}
                        </Typography>
                        {step.images && step.images.length > 0 && (
                          <Box mt={1} mb={1}>
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ overflowX: "auto" }}
                            >
                              {step.images.map((image, imgIndex) => (
                                <Box
                                  onClick={() => handleImage(image.original)}
                                  key={imgIndex}
                                  borderRadius={2}
                                  component="img"
                                  sx={{
                                    width: 64,
                                    height: 64,
                                    objectFit: "cover",
                                    ":hover": {
                                      cursor: "pointer",
                                    },
                                  }}
                                  src={image.original}
                                />
                              ))}
                            </Stack>
                          </Box>
                        )}
                        <Typography
                          variant="body1"
                          gutterBottom
                          color="secondary.main"
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleProductionInfoIdChange(index)}
                          fontWeight="bold"
                        >
                          Lihat Detail
                        </Typography>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
                <Box sx={{ height: "60px" }} />
              </>
            )}
            {transactionDetailDialog === 3 && isXs && (
              // Production Info Detail (Mobile Only)
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Box sx={{ width: "calc(100% - 35px)", mr: 1 }}>
                    <BorderLinearProgress
                      variant="determinate"
                      value={product.productionInfo[productionInfoId].progress}
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                    >{`${Math.round(
                      product.productionInfo[productionInfoId].progress
                    )}%`}</Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2, mt: 2 }} />
                <Typography variant="body1" fontWeight="bold" gutterBottom>
                  {new Date(
                    product.productionInfo[productionInfoId].createdAt
                  ).toShortFormatWithDay()}
                </Typography>
                <Box mb={2} />
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {product.productionInfo[productionInfoId].description}
                </Typography>
                {product.productionInfo[productionInfoId].images &&
                  product.productionInfo[productionInfoId].images.length >
                    0 && (
                    <Box mt={2}>
                      <Grid container spacing={1}>
                        {product.productionInfo[productionInfoId].images.map(
                          (image, imgIndex) => (
                            <Grid item size={4} key={imgIndex}>
                              <Box
                                onClick={() => handleImage(image.original)}
                                borderRadius={2}
                                component="img"
                                sx={{
                                  width: "100%",
                                  objectFit: "cover",
                                  ":hover": {
                                    cursor: "pointer",
                                  },
                                }}
                                src={image.original}
                              />
                            </Grid>
                          )
                        )}
                      </Grid>
                    </Box>
                  )}
                <Box sx={{ height: "60px" }} />
              </>
            )}
          </DialogContent>
        </BootstrapDialog>
        //Transaction Detail Dialog End
      )}

      {!isXs ? (
        <PrimarySearchAppBar nav="transactions" />
      ) : (
        <MobileTransactionAppBar
          term={transactionSearchInputValue}
          status={status}
        />
      )}
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
            Daftar Transaksi
          </Typography>
          <Box mb={2} />
          <Stack direction="row" spacing={2}>
            <Box>
              <TextField
                fullWidth
                id="search"
                placeholder="Cari Transaksi"
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
                defaultValue={transactionSearchInputValue}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  },
                }}
                variant="outlined"
              />
            </Box>
            <Box>
              <DatePicker
                slotProps={{
                  textField: {
                    error: false,
                  },
                }}
                format="DD/MM/YYYY"
                name="startDate"
                value={startDate}
                onChange={(newValue) => handleStartDateChange(newValue)}
                label="Dari Tanggal"
                maxDate={
                  endDate === null
                    ? dayjs()
                    : endDate < dayjs()
                    ? endDate
                    : dayjs()
                }
                closeOnSelect
              />
            </Box>
            <Box>
              <DatePicker
                slotProps={{
                  textField: {
                    error: false,
                  },
                }}
                format="DD/MM/YYYY"
                name="endDate"
                value={endDate}
                onChange={(newValue) => handleEndDateChange(newValue)}
                label="Sampai Tanggal"
                minDate={startDate}
                maxDate={dayjs()}
                closeOnSelect
              />
            </Box>
          </Stack>
          <Box mb={2} />
          <Stack direction="row" spacing={1}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ fontWeight: "bold" }} variant="body1">
                Status
              </Typography>
            </Box>
            <Button
              onClick={handleStatusChange}
              value="semua"
              variant="contained"
              sx={{
                backgroundColor:
                  status === "semua" ? "secondary.main" : "#2f2f2f",
                mb: 1,
                mr: 1,
                textTransform: "none",
              }}
            >
              Semua
            </Button>
            <Button
              onClick={handleStatusChange}
              value="selesai"
              variant="contained"
              sx={{
                backgroundColor:
                  status === "selesai" ? "secondary.main" : "#2f2f2f",
                mb: 1,
                mr: 1,
                textTransform: "none",
              }}
            >
              Selesai
            </Button>
            <Button
              onClick={handleStatusChange}
              value="dikirim"
              variant="contained"
              sx={{
                backgroundColor:
                  status === "dikirim" ? "secondary.main" : "#2f2f2f",
                mb: 1,
                mr: 1,
                textTransform: "none",
              }}
            >
              Dikirim
            </Button>
            <Button
              onClick={handleStatusChange}
              value="diproduksi"
              variant="contained"
              sx={{
                backgroundColor:
                  status === "diproduksi" ? "secondary.main" : "#2f2f2f",
                mb: 1,
                mr: 1,
                textTransform: "none",
              }}
            >
              Diproduksi
            </Button>
            <Button
              onClick={handleStatusChange}
              value="gbOngoing"
              variant="contained"
              sx={{
                backgroundColor:
                  status === "gbOngoing" ? "secondary.main" : "#2f2f2f",
                mb: 1,
                mr: 1,
                textTransform: "none",
              }}
            >
              GB Ongoing
            </Button>
            <Button
              onClick={handleStatusChange}
              value="gagal"
              variant="contained"
              sx={{
                backgroundColor:
                  status === "gagal" ? "secondary.main" : "#2f2f2f",
                mb: 1,
                mr: 1,
                textTransform: "none",
              }}
            >
              Gagal
            </Button>
            <Button
              onClick={handleResetButton}
              disableRipple
              variant="text"
              sx={{ textTransform: "none" }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                color="secondary.main"
              >
                Reset Filter
              </Typography>
            </Button>
          </Stack>
          <Box mb={4} />
        </Box>
        <Box>
          {filteredTransactions.items.map((transaction, index) => {
            const status = checkStatus(transaction);
            const product = products.find((p) => {
              return p.id === transaction.item.itemId;
            });
            return (
              <>
                <Box
                  border={1}
                  borderRadius={2}
                  width="100%"
                  sx={{
                    borderColor: "rgba(255,255,255,0.2)",
                    p: { xs: 2, sm: 2, md: 3 },
                    pb: { xs: 2, sm: 2, md: 2 },
                  }}
                  onClick={() => {
                    isXs
                      ? handleTransactionDetailDialogOpen(transaction, product)
                      : null;
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <ShoppingBag />
                    <Typography variant="body1">Belanja</Typography>
                    <Typography variant="body1" color="rgb(146, 146, 146)">
                      {new Date(transaction.createdAt).toShortFormat()}
                    </Typography>
                    <Box
                      p={0.75}
                      pr={2}
                      pl={2}
                      borderRadius={4}
                      sx={{ backgroundColor: statusColor(status).background }}
                    >
                      <Typography
                        variant="body2"
                        color={statusColor(status).text}
                      >
                        {status}
                      </Typography>
                    </Box>
                  </Stack>
                  <Box mb={2} />
                  <Divider />
                  <Box mb={2} />
                  <Grid container columnSpacing={2}>
                    <Grid size={{ xs: 3, sm: 2, md: 1 }}>
                      <Box
                        borderRadius={2}
                        component="img"
                        sx={{
                          width: "100%",
                          height: { xs: 90, sm: 110, md: 100 },
                          objectFit: "cover",
                        }}
                        src={product.mainImage}
                      />
                    </Grid>
                    <Grid size={{ xs: 9, sm: 7, md: 9 }}>
                      <Stack gap={0.75}>
                        <Typography variant="h7" fontWeight="bold">
                          {product.title}
                        </Typography>
                        <Typography color="rgb(146, 146, 146)" variant="body1">
                          {transaction.item.quantity + " Barang"}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 0, sm: 3, md: 2 }}>
                      <Box
                        sx={{
                          display: { xs: "none", sm: "flex" },
                          borderLeft: 1,
                          borderColor: "rgba(255,255,255,0.2)",
                          pl: 2,
                        }}
                      >
                        <Stack gap={0.75}>
                          <Typography variant="body1">Total Belanja</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {"Rp." + formatPrice(getVariantPrice(transaction))}
                          </Typography>
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box
                    sx={{ display: { xs: "none", sm: "flex" } }}
                    justifyContent="flex-end"
                  >
                    <Button
                      disableRipple
                      variant="text"
                      sx={{ textTransform: "none" }}
                      onClick={() =>
                        handleTransactionDetailDialogOpen(transaction, product)
                      }
                    >
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="secondary.main"
                      >
                        Lihat Detail Transaksi
                      </Typography>
                    </Button>
                  </Box>
                </Box>
                <Box mt={{ xs: 1, sm: 2 }} />
              </>
            );
          })}
        </Box>
        <Box
          display="flex"
          direction="row"
          justifyContent="flex-end"
          width="100%"
        >
          <Pagination
            count={pageTotal}
            page={page}
            onChange={handlePageChange}
            sx={{
              "& .Mui-selected": {
                backgroundColor: "#00A329 !important",
              },
            }}
          />
        </Box>
      </Box>
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <BottomNav value={2} />
      </Box>
    </>
  );
}

export default Transactions;
