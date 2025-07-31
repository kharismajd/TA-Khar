import React from "react";
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
  return date === null || date === "" || isNaN(date) ? null : dayjs(date);
}

Date.prototype.toShortFormat = function () {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = this.getDate();

  const monthIndex = this.getMonth();
  const monthName = monthNames[monthIndex];

  const year = this.getFullYear();

  return `${day} ${monthName} ${year}`;
};

function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactionSearchInputValue, setTransactionSearchInputValue] =
    React.useState(checkNullString(searchParams.get("transactionTerm"), ""));
  const [startDate, setStartDate] = React.useState(
    setDate(searchParams.get("startDate"))
  );
  const [endDate, setEndDate] = React.useState(
    setDate(searchParams.get("endDate"))
  );
  const [status, setStatus] = React.useState(
    checkNullString(searchParams.get("status"), "semua")
  );
  const [page, setPage] = React.useState(
    checkNull(parseInt(searchParams.get("transactionPage")), 1)
  );

  const navigate = useNavigate();
  let itemsPerPage = 10;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  console.log(startDate);

  const handleInputChange = (event) => {
    setTransactionSearchInputValue(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleStartDateChange = (value) => {
    setStartDate(value);
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);
  };

  const applyFilter = (
    transactionSearchInputValue,
    status,
    startDate,
    endDate,
    page
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
        page
    );
    scrollToTop();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      applyFilter(
        transactionSearchInputValue,
        status,
        startDate,
        endDate,
        page
      );
    }
  };

  const handleResetButton = () => {
    setTransactionSearchInputValue("");
    setStatus("semua");
    setPage(1);
    setStartDate(null);
    setEndDate(null);
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

  React.useEffect(() => {
    applyFilter(transactionSearchInputValue, status, startDate, endDate, page);
  }, [startDate, endDate, status, page]);

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
      <PrimarySearchAppBar nav="transactions" />
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
                defaultValue={searchParams.get("transactionTerm")}
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
                <Box mt={2} />
              </>
            );
          })}
        </Box>
        <Box
          sx={{ display: { xs: "none", sm: "flex" } }}
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
