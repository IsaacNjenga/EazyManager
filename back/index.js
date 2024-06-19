const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ProductsModel = require("./models/productsModel");
const SalesModel = require("./models/salesModel");
const StaffModel = require("./models/staffModel");
const ExpensesModel = require("./models/expensesModel");
const UserModel = require("./models/userModel");
const logoutModel = require("./models/logoutModel");
const loginModel = require("./models/loginModel");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const moment = require("moment");

const app = express();

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // to parse JSON bodies
app.use(cookieParser());

//cors configuration
const corsOptions = {
  origin: `https://eazy-manager-front.vercel.app`,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

//cors handler function
const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};
app.use(allowCors);

//database connection
mongoose
  .connect(
    "mongodb+srv://IsaacNjenga:cations!@cluster0.xf14h71.mongodb.net/EasyManager"
  )
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("err", err));

//Session setup
app.use(
  session({
    secret: "my_very_complex_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 300000 }, // Example: 5 minutes
  })
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
    .catch((error) => {
      if (error.message === "PayloadTooLargeError") {
        res.status(400).json({
          error: "PayloadTooLargeError",
          message: "Request entity too large",
        });
      } else {
        res.status(500).json({
          error: "ServerError",
          message: "An unexpected error occurred",
        });
      }
    });
});

app.post("/addSale", async (req, res) => {
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

  try {
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

    await newSale.save();
    const product = await ProductsModel.findOne({ number: pnumber });

    if (!product) {
      return res.status(404).json({ error: "Product not Found" });
    }
    product.quantity -= quantity;
    await product.save();
    res.json(newSale);
  } catch (err) {
    if (err instanceof PayloadTooLargeError) {
      // Handle the PayloadTooLargeError
      return res.status(413).json({ error: "Request entity too large" });
    } else {
      // Handle other errors
      return res.status(500).json({ error: "Internal server error" });
    }
  }
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
    res.status(400).json({ error: error.message });
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

app.delete("/deleteStaff/:id", (req, res) => {
  const id = req.params.id;
  StaffModel.findByIdAndDelete({ _id: id })
    .then((staff) => res.json(staff))
    .catch((err) => res.json(err));
});

app.delete("/deleteExpense/:id", (req, res) => {
  const id = req.params.id;
  ExpensesModel.findByIdAndDelete({ _id: id })
    .then((expenses) => res.json(expenses))
    .catch((err) => res.json(err));
});

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

app.post("/register", async (req, res) => {
  try {
    const { name, number, password, role } = req.body;
    if (!name) {
      return res.json({
        error: "Name is required",
      });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters long",
      });
    }
    const exist = await UserModel.findOne({ number });
    if (exist) {
      return res.json({ error: "This ID already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await UserModel.create({
      name,
      number,
      password: hashedPassword,
      role,
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
});

//the backend
app.post("/login", async (req, res) => {
  try {
    const { number, password } = req.body;
    const loginTime = moment().format("DD-MM-YYYY, HH:mm:ss");

    const user = await UserModel.findOne({ number });
    if (!user) {
      return res.json({ error: "User not found" });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.json({ error: "Incorrect password" });
    }

    const token = jwt.sign(
      { number: user.number, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const loginInfo = new loginModel({ number, loginTime });
    await loginInfo.save();

    req.session.user = {
      number: user.number,
      loginTime: new Date().toISOString(),
    };

    res.cookie("token", token, { httpOnly: true }).json({
      success: "Logged in successfully",
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//check for session
app.get("/check-session", (req, res) => {
  if (req.session.user) {
    res.json({ session: req.session.user });
  } else {
    res.json({ error: "No active session" });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) {
        console.error("JWT verification error:", err); // Debugging
        res.json(null); // Or appropriate error response
      } else {
        res.json(user); // Return user details
      }
    });
  } else {
    res.json(null); // No token found
  }
});

app.get("/logout", async (req, res) => {
  try {
    if (req.session.user) {
      const { number } = req.session.user;
      const logoutTime = moment().format("DD-MM-YYYY, HH:mm:ss");

      //save the logout info in db
      const logOutInfo = new logoutModel({ number, logoutTime });
      await logOutInfo.save();

      // Clear session and cookies
      req.session.destroy((err) => {
        if (err) {
          console.error("Failed to destroy session:", err);
          return res.status(500).json({ error: "Failed to logout" });
        }

        res.clearCookie("token");
        res.clearCookie("connect.sid");
        res.json({ message: "User logged out" });
      });
    } else {
      console.log("No user session found");
      res.status(400).json({ error: "No user session found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3001, () => {
  console.log("Connected");
});
