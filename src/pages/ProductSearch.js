import React from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  RadioGroup,
  Radio,
  Stack,
  Pagination,
  Divider,
  Backdrop,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { red } from "@mui/material/colors";
import BottomNav from "../components/BottomNav";
import PrimarySearchAppBar from "../components/AppAppBar";
import products from "../products.json";
import {
  useNavigate,
  useParams,
  Link,
  useSearchParams,
} from "react-router-dom";
import { SentimentDissatisfied } from "@mui/icons-material";

function formatPrice(n) {
  return n.toFixed(0).replace(/./g, function (c, i, a) {
    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "." + c : c;
  });
}

function checkStringBoolean(string) {
  return string === "true" ? true : false;
}

function checkNullString(any, defaultReturn) {
  return any === null ? defaultReturn : any;
}

function checkNull(any, defaultReturn) {
  return any === null || isNaN(any) ? defaultReturn : any;
}

function ProductSearch() {
  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  let jenis = {
    gb: checkStringBoolean(searchParams.get("gb")),
    ic: checkStringBoolean(searchParams.get("ic")),
  };

  let kondisi = {
    berlangsung: checkStringBoolean(searchParams.get("berlangsung")),
    selesai: checkStringBoolean(searchParams.get("selesai")),
  };

  let urutkan = checkNullString(searchParams.get("urutkan"), "sesuai");
  let page = checkNull(parseInt(searchParams.get("page")), 1);
  let term = checkNullString(searchParams.get("term"), "");
  let itemsPerPage = 20;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePageChange = (event, value) => {
    page = value;
    applyFilter(term, jenis, kondisi, urutkan, page);
  };

  const handleJenisChange = (event) => {
    jenis[event.target.value] = event.target.checked;
    applyFilter(term, jenis, kondisi, urutkan, page);
  };

  const handleKondisiChange = (event) => {
    kondisi[event.target.value] = event.target.checked;
    applyFilter(term, jenis, kondisi, urutkan, page);
  };

  const handleUrutkanChange = (event) => {
    urutkan = event.target.value;
    applyFilter(term, jenis, kondisi, urutkan, page);
  };

  const applyFilter = (term, jenis, kondisi, urutkan, page) => {
    navigate(
      "/search-product?term=" +
        term +
        "&gb=" +
        jenis.gb +
        "&ic=" +
        jenis.ic +
        "&berlangsung=" +
        kondisi.berlangsung +
        "&selesai=" +
        kondisi.selesai +
        "&urutkan=" +
        urutkan +
        "&page=" +
        page
    );
    scrollToTop();
  };

  const filterProducts = (
    term,
    jenis,
    kondisi,
    urutkan,
    page,
    itemsPerPage
  ) => {
    const filteredProducts = [];
    for (const product of products) {
      if (
        ((jenis.gb === true && product.type === "Group Buy") ||
          (jenis.ic === true && product.type === "Interest Check")) &&
        ((kondisi.berlangsung === true && product.status === "ongoing") ||
          (kondisi.selesai === true && product.status === "ended")) &&
        product.title.toLowerCase().includes(term.toLowerCase())
      ) {
        filteredProducts.push(product);
      }
    }

    if (urutkan === "sesuai") {
      // nothing
    }

    if (urutkan === "terbaru") {
      filteredProducts.sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
    }

    if (urutkan === "harga-tertinggi") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    if (urutkan === "harga terendah") {
      filteredProducts.sort((a, b) => a.price - b.price);
    }

    return {
      items: filteredProducts.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
      ),
      total: filteredProducts.length,
    };
  };

  const { gb, ic } = jenis;
  const { berlangsung, selesai } = kondisi;

  const filteredProducts = filterProducts(
    term,
    jenis,
    kondisi,
    urutkan,
    page,
    itemsPerPage
  );
  const pageTotal = Math.ceil(filteredProducts.total / itemsPerPage);

  return (
    <>
      <PrimarySearchAppBar
        nav="search"
        jenis={jenis}
        kondisi={kondisi}
        urutkan={urutkan}
      />
      <Box
        sx={{
          pr: { xs: 1, sm: 4, md: "6%" },
          pl: { xs: 1, sm: 4, md: "6%" },
          mb: { xs: 10, sm: 4 },
          mt: 1,
        }}
      >
        <Grid container columnSpacing={2}>
          <Grid size={{ xs: 0, sm: 3 }}>
            <Box
              border={1}
              borderColor="divider"
              borderRadius={2}
              sx={{
                display: { xs: "none", sm: "block" },
                position: "sticky",
                top: 75,
                bgcolor: "#242c36",
              }}
            >
              <Typography
                sx={{ textAlign: "center", fontWeight: "bold", mb: 1, mt: 1 }}
                variant="h6"
              >
                Filter
              </Typography>
              <Divider />
              <Accordion
                disableGutters
                defaultExpanded
                sx={{ backgroundColor: "#19212c" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography component="span">Tahap Produk</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="gb"
                          checked={gb}
                          onChange={handleJenisChange}
                          sx={{
                            color: "#b2b2b2",
                            "&.Mui-checked": { color: "secondary.main" },
                          }}
                        />
                      }
                      label="Group Buy"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="ic"
                          checked={ic}
                          onChange={handleJenisChange}
                          sx={{
                            color: "#b2b2b2",
                            "&.Mui-checked": { color: "secondary.main" },
                          }}
                        />
                      }
                      label="Interest Check"
                    />
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
              <Accordion
                disableGutters
                defaultExpanded
                sx={{ backgroundColor: "#19212c" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <Typography component="span">Kondisi</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="berlangsung"
                          checked={berlangsung}
                          onChange={handleKondisiChange}
                          sx={{
                            color: "#b2b2b2",
                            "&.Mui-checked": { color: "secondary.main" },
                          }}
                        />
                      }
                      label="Sedang Berlangsung"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="selesai"
                          checked={selesai}
                          onChange={handleKondisiChange}
                          sx={{
                            color: "#b2b2b2",
                            "&.Mui-checked": { color: "secondary.main" },
                          }}
                        />
                      }
                      label="Selesai"
                    />
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
              <Accordion
                defaultExpanded
                disableGutters
                sx={{ backgroundColor: "#19212c" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3-content"
                  id="panel3-header"
                >
                  <Typography component="span">Urutkan</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl>
                    <RadioGroup
                      defaultValue="sesuai"
                      name="radio-buttons-group"
                      value={urutkan}
                      onChange={handleUrutkanChange}
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            value="sesuai"
                            sx={{
                              color: "#b2b2b2",
                              "&.Mui-checked": { color: "secondary.main" },
                            }}
                          />
                        }
                        label="Paling Sesuai"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            value="terbaru"
                            sx={{
                              color: "#b2b2b2",
                              "&.Mui-checked": { color: "secondary.main" },
                            }}
                          />
                        }
                        label="Terbaru"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            value="harga-tertinggi"
                            sx={{
                              color: "#b2b2b2",
                              "&.Mui-checked": { color: "secondary.main" },
                            }}
                          />
                        }
                        label="Harga Tertinggi"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            value="harga-terendah"
                            sx={{
                              color: "#b2b2b2",
                              "&.Mui-checked": { color: "secondary.main" },
                            }}
                          />
                        }
                        label="Harga Terendah"
                      />
                    </RadioGroup>
                  </FormControl>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 9 }}>
            {filteredProducts.total === 0 ? (
              <Grid container justifyContent="center" height="100%">
                <Stack height="100%" justifyContent="center">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <SentimentDissatisfied
                      sx={{ height: 200, width: 200, color: "#e1e1e1" }}
                    />
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography variant="h5">
                      Tidak ada produk yang sesuai
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            ) : (
              <Grid
                container
                spacing={{ xs: 1, md: 2 }}
                rowSpacing={{ xs: 1, md: 2 }}
              >
                {filteredProducts.items.map((filteredProduct) => (
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Link
                      to={"../product/" + filteredProduct.id}
                      style={{ textDecoration: "none" }}
                    >
                      <Card
                        variant="outlined"
                        elevation={0}
                        sx={{
                          maxWidth: 345,
                          backgroundColor: "#19212c",
                          borderRadius: 2,
                        }}
                      >
                        <CardMedia
                          sx={{
                            height: { xs: 180, sm: 140, md: 200 },
                            position: "relative",
                          }}
                          image={filteredProduct.mainImage}
                          title={filteredProduct.title}
                        >
                          <Backdrop
                            timeout={0}
                            open={filteredProduct.status === "ended"}
                            sx={{
                              mb: 4,
                              position: "relative",
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(0, 0, 0, 0.6)",
                              display: "block",
                            }}
                          />
                          <Box
                            width="100%"
                            display={
                              filteredProduct.status === "ended"
                                ? "flex"
                                : "none"
                            }
                            py="4px"
                            justifyContent="center"
                            position="absolute"
                            top="0px"
                            sx={{ backgroundColor: "#db3b2fff" }}
                          >
                            <Typography variant="body2">
                              Telah Berakhir
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              pt: "4px",
                              pb: "4px",
                              pl: "8px",
                              pr: "8px",
                              display: "flex",
                              justifyContent: "center",
                              position: "absolute",
                              bottom: "0px",
                              left: "0px",
                              borderTopRightRadius: 8,
                              bgcolor:
                                filteredProduct.type === "Group Buy"
                                  ? "#00A329"
                                  : "#851db8ff",
                            }}
                          >
                            <Typography variant="body2" component="div">
                              {filteredProduct.type}
                            </Typography>
                          </Box>
                        </CardMedia>
                        <CardContent sx={{ pt: 2, "&:last-child": { pb: 2 } }}>
                          <Typography
                            gutterBottom
                            variant="body2"
                            noWrap={true}
                          >
                            {filteredProduct.title}
                          </Typography>
                          <Typography
                            gutterBottom
                            sx={{ fontWeight: "bold" }}
                            variant="body2"
                            noWrap={true}
                          >
                            {"Rp" + formatPrice(filteredProduct.price)}
                          </Typography>
                          <Typography
                            sx={{ fontSize: 12 }}
                            variant="body2"
                            noWrap={true}
                          >
                            {filteredProduct.storeName}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                ))}
                <Box
                  sx={{ display: { xs: "none", sm: "flex" } }}
                  direction="row"
                  justifyContent="flex-end"
                  width="100%"
                >
                  <Pagination
                    count={pageTotal}
                    page={page}
                    onChange={handlePageChange}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <BottomNav value={0} />
        </Box>
      </Box>
    </>
  );
}

export default ProductSearch;
