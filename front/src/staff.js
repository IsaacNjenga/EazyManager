import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StaffTable from "./pages/staffTable";
import UpdateStaff from "./pages/updateStaff";
import AddStaff from "./pages/addStaff";

function Sales() {
  return (
    <div>
      <div id="main">
        <h1 style={{ textAlign: "center" }}>Staff</h1>
        <hr />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StaffTable />} />
            <Route path="/update/:id" element={<UpdateStaff />} />
            <Route path="/add" element={<AddStaff />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default Sales;
