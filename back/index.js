const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ProductsModel = require("./models/productsModel");
const SalesModel = require("./models/salesModel");
const StaffModel = require("./models/staffModel");
const ExpensesModel = require("./models/expensesModel");

const app = express();
app.use(express.json());
app.use(cors( {
    origin:["https://eazy-manager-front.vercel.app"],
    methods:["POST","GET"],
    credentials: true
  }));

mongoose.connect(
  "mongodb+srv://IsaacNjenga:cations!@cluster0.xf14h71.mongodb.net/EasyManager"
);

app.get("/products", (req, res) => {
  ProductsModel.find({})
    .then((products) => res.json(products))
    .catch((err) => res.json(err));
});

app.get("/sales", (req, res) => {
  SalesModel.find({})
    .then((sales) => res.json(sales))
    .catch((err) => res.json(err));
});

app.get("/staff", (req, res) => {
  StaffModel.find({})
    .then((staff) => res.json(staff))
    .catch((err) => res.json(err));
});

app.get("/expenses", (req, res) => {
  ExpensesModel.find({})
    .then((expenses) => res.json(expenses))
    .catch((err) => res.json(err));
});

app.post("/add", (req, res) => {
  const {
    number,
    description,
    colour,
    price,
    quantity,
    code,
    location,
    bnumber,
    summary,
    image,
  } = req.body;

  const newProduct = new ProductsModel({
    number,
    description,
    colour,
    price,
    quantity,
    code,
    location,
    bnumber,
    summary,
    image,
  });

  newProduct
    .save()
    .then((product) => res.json(product))
    .catch((err) => res.status(400).json(err));
});

app.post("/addSale", (req, res) => {
  const {
    number,
    description,
    price,
    quantity,
    total,
    datesold,
    saleperson,
    commission,
    image,
    pnumber,
    code,
    colour,
  } = req.body;

  const newSale = new SalesModel({
    number,
    description,
    price,
    quantity,
    total,
    datesold,
    saleperson,
    commission,
    image,
    pnumber,
    code,
    colour,
  });

  newSale
    .save()
    .then((sale) => res.json(sale))
    .catch((err) => res.status(400).json(err));
});

app.post("/addExpense", (req, res) => {
  const { number, description, cost, category, date } = req.body;

  const newExpense = new ExpensesModel({
    number,
    description,
    cost,
    category,
    date,
  });

  newExpense
    .save()
    .then((expense) => res.json(expense))
    .catch((err) => res.status(400).json(err));
});

app.post("/addStaff", (req, res) => {
  const { id, firstname, lastname, datejoined, image, number } = req.body;

  const newStaff = new StaffModel({
    id,
    firstname,
    lastname,
    datejoined,
    image,
    number,
  });

  newStaff
    .save()
    .then((staff) => res.json(staff))
    .catch((err) => res.status(400).json(err));
});

app.put("/updateProducts/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.put("/updateSales/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const updatedSale = await SalesModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedSale);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.put("/updateStaff/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const updatedStaff = await StaffModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedStaff);
  } catch (error) {
    res.status(400).json(err);
  }
});

app.put("/updatedExpenses/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const updatedExpense = await ExpensesModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json(err);
  }
});

app.get("/getProducts/:id", (req, res) => {
  const id = req.params.id;
  ProductsModel.findById(id)
    .then((products) => res.json(products))
    .catch((err) => res.json(err));
});

app.get("/getSales/:id", (req, res) => {
  const id = req.params.id;
  SalesModel.findById(id)
    .then((sales) => res.json(sales))
    .catch((err) => res.json(err));
});

app.get("/getExpenses/:id", (req, res) => {
  const id = req.params.id;
  ExpensesModel.findById(id)
    .then((expenses) => res.json(expenses))
    .catch((err) => res.json(err));
});

app.get("/getStaff/:id", (req, res) => {
  const id = req.params.id;
  StaffModel.findById(id)
    .then((staff) => res.json(staff))
    .catch((err) => res.json(err));
});

app.delete("/deleteProduct/:id", (req, res) => {
  const id = req.params.id;
  ProductsModel.findByIdAndDelete({ _id: id })
    .then((products) => res.json(products))
    .catch((err) => res.json(err));
});

app.delete("/deleteSale/:id", (req, res) => {
  const id = req.params.id;
  SalesModel.findByIdAndDelete({ _id: id })
    .then((sales) => res.json(sales))
    .catch((err) => res.json(err));
});

app.delete("/deleteExpense/:id", (req, res) => {
  const id = req.params.id;
  StaffModel.findByIdAndDelete({ _id: id })
    .then((staff) => res.json(staff))
    .catch((err) => res.json(err));
});

app.delete("/deleteStaff/:id", (req, res) => {
  const id = req.params.id;
  ExpensesModel.findByIdAndDelete({ _id: id })
    .then((expenses) => res.json(expenses))
    .catch((err) => res.json(err));
});

app.listen(3001, () => {
  console.log("Connected");
});
