import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Product from "./pages/Product";
import { Container } from "@mui/material";
import ProductSearch from "./pages/ProductSearch";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search-product" element={<ProductSearch />} />
        <Route path="/product/:productId" element={<Product />} />
      </Routes>
    </Router>
  );
}

export default App;
