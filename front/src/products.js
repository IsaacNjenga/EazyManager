import React from "react";
import ProductsTable from "./pages/productsTable";
import AddProducts from "./pages/addProducts";
import UpdateProducts from "./pages/updateProducts";
import { Routes, Route } from "react-router-dom";
import Navbar from "./source/navbar";

function Products() {
  return (
    <>
      <Navbar />
      <div id="main">
        <h1 style={{ textAlign: "center" }}>Products</h1>
        <hr />
        <Routes>
          <Route path="/" element={<ProductsTable />} />
          <Route path="/update-product/:id" element={<UpdateProducts />} />
          <Route path="/add-product" element={<AddProducts />} />
        </Routes>
      </div>
    </>
  );
}

export default Products;
