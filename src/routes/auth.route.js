const express = require("express");
const AccountController = require("../controllers/account.controller.js");
const authRouter = express.Router();
authRouter.post("/login", AccountController.signIn);
authRouter.post("/signup", AccountController.signUp);
module.exports = authRouter;
