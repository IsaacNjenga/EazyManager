import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logoutModel from "./models/logoutModel.js";
import "./config/db.js";
import session from "express-session";
import moment from "moment";
import { Router } from "./routes/routes.js";
import bodyParser from "body-parser";

dotenv.config({ path: "./config/.env" });

const app = express();

const corsOptions = {
  origin: ["https://eazy-manager-front.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "10mb" })); // Increase the limit as needed
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
//app.use(express.json()); // to parse JSON bodies
//app.use(express.urlencoded({ extended: false }));

//Session setup
app.use(
  session({
    secret: "my_very_complex_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 300000 },
  })
);

// Handle CORS preflight requests
app.use((req, res, next) => {
  //console.log("Request Method:", req.method);
 // console.log("Request Headers:", req.headers);
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  next();
});

//main routes
app.use("/EasyManager", Router);

//logout route
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

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Connected on port ${PORT}`);
});
