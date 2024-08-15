import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    number: String,
    description: String,
    price: Number,
    quantity: Number,
    total: Number,
    datesold: String,
    saleperson: String,
    commission: Number,
    image: String,
    pnumber: String,
    code: String,
    colour: String,
  },
  { collection: "sales", timestamps: true }
);

const SalesModel = mongoose.model("Sale", salesSchema);
export default SalesModel;
