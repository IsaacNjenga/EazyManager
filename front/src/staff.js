import React from "react";
import { Routes, Route } from "react-router-dom";
import StaffTable from "./pages/staffTable";
import UpdateStaff from "./pages/updateStaff";
import AddStaff from "./pages/addStaff";
import Navbar from "./source/navbar";

function Sales() {
  return (
    <div>
      <Navbar/>
      <div id="main">
        <h1 style={{ textAlign: "center" }}>Staff</h1>
        <hr />
        <Routes>
          <Route path="/" element={<StaffTable />} />
          <Route path="/update-staff/:id" element={<UpdateStaff />} />
          <Route path="/add-staff" element={<AddStaff />} />
        </Routes>
      </div>
    </div>
  );
}

export default Sales;
