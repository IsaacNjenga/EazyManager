import React from "react";
import { Routes, Route } from "react-router-dom";
import SalesTable from "./pages/salesTable";
import UpdateSale from "./pages/updateSale";
import AddSale from "./pages/addSale";

function Sales() {
  return (
    <div>
      <div id="main">
        <h1 style={{ textAlign: "center" }}>Sales</h1>
        <hr />
        <Routes>
          <Route path="/" element={<SalesTable />} />
          <Route path="/update-sale/:id" element={<UpdateSale />} />
          <Route path="/add-sale" element={<AddSale />} />
        </Routes>
      </div>
    </div>
  );
}

export default Sales;
