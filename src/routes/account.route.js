const express = require("express");
const AccountController = require("../controllers/account.controller.js");
const accountRouter = express.Router();
accountRouter.get("/profile", AccountController.getProfile);
module.exports = accountRouter;
