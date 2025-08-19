import React from "react";
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import PrimarySearchAppBar from "../components/AppAppBar";
import BottomNav from "../components/BottomNav";
import products from "../products.json";

const ongoingGroupBuyProducts = [];
for (const value of products) {
  if (value.type === "Group Buy" && value.status === "ongoing")
    ongoingGroupBuyProducts.push(value);
  if (ongoingGroupBuyProducts.length === 4) break;
}

const ongoingInterestCheckProducts = [];
for (const value of products) {
  if (value.type === "Interest Check" && value.status === "ongoing")
    ongoingInterestCheckProducts.push(value);
  if (ongoingInterestCheckProducts.length === 4) break;
}

function formatPrice(n) {
  return n.toFixed(0).replace(/./g, function (c, i, a) {
    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "." + c : c;
  });
}

function Home() {
  const navigate = useNavigate();
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
        <Typography
          sx={{ textAlign: { xs: "left", md: "center" }, fontWeight: "bold", cursor: "pointer" }}
          variant="h5"
          onClick={() => navigate("./search-product?&gb=true&ic=false&berlangsung=true&selesai=false&urutkan=sesuai&page=1")}
        >
          Ongoing Group Buys
        </Typography>
        <Box sx={{ flexGrow: 1, mt: 2, mb: 3 }}>
          <Grid container spacing={{ xs: 1, md: 4 }}>
            {ongoingGroupBuyProducts.map((ongoingGroupBuyProduct) => (
              <Grid size={{ xs: 6, sm: 3 }}>
                <Link
                  to={"product/" + ongoingGroupBuyProduct.id}
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
                      sx={{ height: { xs: 180, sm: 180, md: 320 } }}
                      image={ongoingGroupBuyProduct.mainImage}
                      title={ongoingGroupBuyProduct.title}
                    />
                    <CardContent sx={{ pt: 2, "&:last-child": { pb: 2 } }}>
                      <Typography gutterBottom variant="body2" noWrap={true}>
                        {ongoingGroupBuyProduct.title}
                      </Typography>
                      <Typography
                        gutterBottom
                        sx={{ fontWeight: "bold" }}
                        variant="body2"
                        noWrap={true}
                      >
                        {"Rp" + formatPrice(ongoingGroupBuyProduct.price)}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 12 }}
                        variant="body2"
                        noWrap={true}
                      >
                        {ongoingGroupBuyProduct.storeName}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Divider></Divider>
        <Typography
          sx={{ textAlign: { xs: "left", md: "center" }, fontWeight: "bold", cursor: "pointer" }}
          variant="h5"
          mt={2}
          onClick={() => navigate("./search-product?&gb=false&ic=true&berlangsung=true&selesai=false&urutkan=sesuai&page=1")}
        >
          Ongoing Interest Checks
        </Typography>
        <Box sx={{ flexGrow: 1, mt: 2 }}>
          <Grid container spacing={{ xs: 1, md: 4 }}>
            {ongoingInterestCheckProducts.map((ongoingInterestCheckProduct) => (
              <Grid size={{ xs: 6, sm: 3 }}>
                <Link
                  to={"product/" + ongoingInterestCheckProduct.id}
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
                      sx={{ height: { xs: 180, sm: 180, md: 320 } }}
                      image={ongoingInterestCheckProduct.mainImage}
                      title="green iguana"
                    />
                    <CardContent sx={{ pt: 2, "&:last-child": { pb: 2 } }}>
                      <Typography gutterBottom variant="body2" noWrap={true}>
                        {ongoingInterestCheckProduct.title}
                      </Typography>
                      <Typography
                        gutterBottom
                        sx={{ fontWeight: "bold" }}
                        variant="body2"
                        noWrap={true}
                      >
                        {"Rp" + formatPrice(ongoingInterestCheckProduct.price)}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 12 }}
                        variant="body2"
                        noWrap={true}
                      >
                        {ongoingInterestCheckProduct.storeName}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <BottomNav value={0} />
        </Box>
      </Box>
    </>
  );
}

export default Home;
