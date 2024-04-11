const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    id: Number,
    firstname: String,
    lastname: String,
    datejoined: String,
    image: String,
    number:Number,
  },
  { collection: "staff" }
);

const StaffModel = mongoose.model("Staff", staffSchema);
module.exports = StaffModel;

