const authService = require("../services/auth.service");
const accountService = require("../services/account.service");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils");
let refreshTokens = [];
module.exports = {
  signIn: async (req, res) => {
    const user = await authService.loginAccount(req);
    if (user) {
      const { accessToken, refreshToken } = generateToken(
        user["_id"],
        user.email,
        user.fullName
      );
      refreshTokens.push(refreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      return res.send({ accessToken });
    } else {
      return res.status(404).send({ message: "User not found" });
    }
  },
  signUp: async (req, res) => {
    const user = await authService.signUpAccount(req);
    if (!user) {
      return res.status(400).send({ message: "User exists" });
    }
    const { accessToken, refreshToken } = generateToken(
      user.email,
      user.fullName
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    res.status(201).send({ accessToken });
  },
  signOut: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // Set to true if using https
      path: "/",
      sameSite: "strict",
    });
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    res.status(204).send({ message: "Logout" });
  },
  refreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = jwt.sign(
        { data: { email: user.data.email, name: user.data.name } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      return res.status(200).json({ accessToken });
    });
  },
  getProfile: async (req, res) => {
    const user = await accountService.findAccount(req);
    return res.send({ user });
  },
};
