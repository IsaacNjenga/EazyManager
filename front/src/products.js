import React from "react";
import AddProducts from "./pages/addProducts";
import ProductsTable from "./pages/productsTable";
import UpdateProducts from "./pages/updateProducts";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Products() {
  return (
    <div>
      <div id="main">
        <h1 style={{ textAlign: "center" }}>Products</h1>
        <hr />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProductsTable />} />
            <Route path="/update/:id" element={<UpdateProducts />} />
            <Route path="/add" element={<AddProducts />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default Products;
