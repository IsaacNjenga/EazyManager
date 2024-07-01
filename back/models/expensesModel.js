import mongoose from "mongoose";

const expensesSchema = new mongoose.Schema(
  {
    number: String,
    description: String,
    cost: Number,
    category: String,
    date: String,
  },
  { collection: "expenses" }
);

const ExpensesModel = mongoose.model("Expense", expensesSchema);
export default ExpensesModel;
