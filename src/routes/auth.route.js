const express = require("express");
const AccountController = require("../controllers/account.controller.js");
const authRouter = express.Router();
authRouter.post("/login", AccountController.signIn);
authRouter.post("/signup", AccountController.signUp);
authRouter.post("/refreshToken", AccountController.refreshToken);
authRouter.post("/logout", AccountController.signOut);

module.exports = authRouter;
