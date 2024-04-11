import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExpenseTable from "./pages/expensesTable";
import UpdateExpense from "./pages/updateExpense";
import AddExpense from "./pages/addExpense";

function Expenses() {
  return (
    <div>
      <div id="main">
        <h1 style={{ textAlign: "center" }}>Expenses</h1>
        <hr />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ExpenseTable />} />
            <Route path="/update/:id" element={<UpdateExpense />} />
            <Route path="/add" element={<AddExpense />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default Expenses;
