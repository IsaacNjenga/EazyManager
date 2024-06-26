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
const bcrypt = require("bcryptjs");
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
  origin: ["https://eazy-manager-front.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  console.log("Request Method:", req.method);
  console.log("Request Headers:", req.headers);
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Origin",
      "https://eazy-manager-front.vercel.app"
    );
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200); // Preflight requests response
  }
  next();
});

//database connection
mongoose
  .connect(
    "mongodb+srv://IsaacNjenga:cations!@cluster0.xf14h71.mongodb.net/EasyManager?retryWrites=true&w=majority&appName=Cluster0"
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

app.get("/logins", (req, res) => {
  loginModel
    .find({})
    .then((logins) => res.json(logins))
    .catch((err) => res.json(err));
});

app.get("/logouts", (req, res) => {
  logoutModel
    .find({})
    .then((logouts) => res.json(logouts))
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

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

// Register endpoint
app.post("/register", async (req, res) => {
  try {
    const { name, number, password, role } = req.body;

    // Validation
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

    // Check if user exists
    const exist = await UserModel.findOne({ number });
    if (exist) {
      return res.json({ error: "This ID already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = await UserModel.create({
      name,
      number,
      password: hashedPassword,
      role,
    });

    // Save user to database
    await user.save();

    // Return success response
    res.json(user);
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { number, password } = req.body;

    // Find user by number
    const user = await UserModel.findOne({ number });
    if (!user) {
      return res.json({ error: "User not found" });
    }
    const name = user.name;
    // Compare passwords
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({ error: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { number: user.number, id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Save login info to database (example)
    const loginTime = moment().format("DD-MM-YYYY, HH:mm:ss");
    const loginInfo = new loginModel({ number, name, loginTime });
    await loginInfo.save();

    // Set session data (example)
    req.session.user = {
      number: user.number,
      name: name,
      loginTime: new Date().toISOString(),
    };

    // Set cookie with JWT token
    res.cookie("token", token, { httpOnly: true }).json({
      success: "Logged in successfully",
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal server error" });
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
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(401).json({ error: "Unauthorized" });
      } else {
        // If verification successful, return user details
        const { number, id, role, name } = decodedToken;
        res.json({ number, id, role, name }); // Adjust as per your user schema
      }
    });
  } else {
    res.status(401).json({ error: "No token found" });
  }
});

app.get("/logout", async (req, res) => {
  try {
    if (req.session.user) {
      const { number } = req.session.user;
      const { name } = req.session.user;
      const logoutTime = moment().format("DD-MM-YYYY, HH:mm:ss");

      //save the logout info in db
      const logOutInfo = new logoutModel({ number, name, logoutTime });
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
