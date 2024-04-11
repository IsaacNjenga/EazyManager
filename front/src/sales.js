import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SalesTable from "./pages/salesTable";
import UpdateSale from "./pages/updateSale";
import AddSale from "./pages/addSale";

function Sales() {
  return (
    <div>
      <div id="main">
        <h1 style={{ textAlign: "center" }}>Sales</h1>
        <hr />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SalesTable />} />
            <Route path="/update/:id" element={<UpdateSale />} />
            <Route path="/add" element={<AddSale />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default Sales;
