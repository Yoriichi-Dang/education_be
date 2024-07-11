const cors = require("cors");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const cookieParser = require("cookie-parser");
const swaggerDocument = YAML.load("./swagger.yaml");
const app = express();
const port = process.env.PORT || 8080;

app.use(cookieParser());
app.use(express.json()); //middleware http payload json express.json is a middleware
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const authRoute = require("./src/routes/auth.route.js");
const accountRoute = require("./src/routes/account.route.js");
const {
  authenticateToken,
  protectRoutes,
} = require("./src/middleware/authenticated.js");
app.use("/", authRoute);
app.use("/", authenticateToken, accountRoute);
const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
