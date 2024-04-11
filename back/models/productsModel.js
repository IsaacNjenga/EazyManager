const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    number: String,
    description: String,
    colour: String,
    price: Number,
    quantity: Number,
    code: String,
    location: String,
    bnumber: String,
    summary: String,
    image: String,
  },
  { collection: "products" }
);

const ProductsModel = mongoose.model("Product", productsSchema);
module.exports = ProductsModel;
