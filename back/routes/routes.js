import express from "express";
import { Register, Login, Auth } from "../controllers/userController.js";
const router = express.Router();
import { VerifyUser } from "../middleware/verifyUser.js";
import {
  getProduct,
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";
import {
  getExpense,
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
} from "../controllers/expenseController.js";
import {
  getSale,
  getSales,
  addSale,
  deleteSale,
  updateSale,
} from "../controllers/saleController.js";
import {
  getStaff,
  getStaffs,
  addStaff,
  deleteStaff,
  updateStaff,
} from "../controllers/staffController.js";
import { logouts, logins } from "../controllers/logsController.js";

//User control endpoints
router.post("/register", Register);
router.post("/login", Login);
router.get("/verify", VerifyUser, Auth);

//Product control endpoints
router.post("/add", VerifyUser, addProduct);
router.get("/products", VerifyUser, getProducts);
router.get("/getProducts/:id", VerifyUser, getProduct);
router.put("/updateProducts/:id", VerifyUser, updateProduct);
router.delete("/deleteProduct/:id", VerifyUser, deleteProduct);

//Sales control endpoints
router.post("/addSale", VerifyUser, addSale);
router.get("/sales", VerifyUser, getSales);
router.get("/getSales/:id", VerifyUser, getSale);
router.put("/updateSales/:id", VerifyUser, updateSale);
router.delete("/deleteSale/:id", VerifyUser, deleteSale);

//Expense control endpoints
router.post("/addExpense", VerifyUser, addExpense);
router.get("/expenses", VerifyUser, getExpenses);
router.get("/getExpenses/:id", VerifyUser, getExpense);
router.put("/updatedExpenses/:id", VerifyUser, updateExpense);
router.delete("/deleteExpense/:id", VerifyUser, deleteExpense);

//Staff control endpoints
router.post("/addStaff", VerifyUser, addStaff);
router.get("/staff", VerifyUser, getStaffs);
router.get("/getStaff/:id", VerifyUser, getStaff);
router.put("/updateStaff/:id", VerifyUser, updateStaff);
router.delete("/deleteStaff/:id", VerifyUser, deleteStaff);

//logs control points
router.get("/logins", logins);
router.get("/logouts", logouts);

export { router as Router };
