import mongoose from "mongoose";

const productsSchema = new mongoose.Schema(
  {
    number: { type: String },
    description: { type: String },
    colour: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    code: { type: String },
    location: { type: String },
    bnumber: { type: String },
    summary: { type: String },
   // image: { type: String },
  },
  { collection: "products", timestamps: true }
);

const ProductsModel = mongoose.model("Product", productsSchema);
export default ProductsModel;
