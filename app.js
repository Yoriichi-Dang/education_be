const connectDB = require("./src/db/connect.js");
const express = require("express");
const authRoute = require("./src/routes/auth.route.js");
const app = express();

app.use(express.json()); //middleware http payload json express.json is a middleware
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8080;
app.use("/", authRoute);
const start = async () => {
  try {
    await connectDB().then(() => {
      console.log("MongoDB connected");
    });
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
