require("dotenv").config();
const mongoose = require("mongoose");
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Backend`;
const connectDB = (url) => {
  return mongoose.connect(uri);
};
module.exports = connectDB;
