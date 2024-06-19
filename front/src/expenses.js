import React from "react";
import { Routes, Route } from "react-router-dom";
import ExpenseTable from "./pages/expensesTable";
import UpdateExpense from "./pages/updateExpense";
import AddExpense from "./pages/addExpense";

function Expenses() {
  return (
    <div>
      <div id="main">
        <h1 style={{ textAlign: "center" }}>Expenses</h1>
        <hr />
        <Routes>
          <Route path="/" element={<ExpenseTable />} />
          <Route path="/update-expense/:id" element={<UpdateExpense />} />
          <Route path="/add-expense" element={<AddExpense />} />
        </Routes>
      </div>
    </div>
  );
}

export default Expenses;
