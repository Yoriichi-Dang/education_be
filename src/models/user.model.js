const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter email"],
      unique: true,
    },
    school: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    fullName: {
      type: String,
      required: [true, "Please enter full name"],
    },
    birthday: {
      type: String,
    },
    avatar: {
      type: String,
    },
    sex: {
      type: Number,
    },
    password: { type: String, required: [true, "Please enter password"] },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("user", userSchema);
module.exports = User;
