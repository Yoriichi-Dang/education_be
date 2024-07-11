const authService = require("../services/auth.service");
const accountService = require("../services/account.service");
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../utils");
module.exports = {
  signIn: async (req, res) => {
    const userProfile = await authService.signInService(req);
    if (!userProfile) {
      return res.sendStatus(404);
    }
    const accessToken = generateAccessToken(
      userProfile["_id"],
      userProfile.email,
      userProfile.fullName,
      userProfile.role
    );
    res.cookie("refreshToken", userProfile.refreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * process.env.REFRESH_EXPIRES_TIME[0],
    });
    return res.status(201).send({ accessToken });
  },
  signUp: async (req, res) => {
    const id = await authService.signUpService(req);
    if (!id) return res.status(400).json({ message: "Email already exists" });
    return res.sendStatus(201);
  },
  signOut: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await authService.signOutService(refreshToken);
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false, // Set to true if using https
        path: "/",
        sameSite: "strict",
      });
      res.status(204).send({ message: "Logout" });
    } else {
      res.status(404).json({ message: "Not found refresh token" });
    }
  },
  refreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) res.sendStatus(401);
    const user = await authService.findAccount(refreshToken);
    if (user.refreshToken !== refreshToken) res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      console.log(user);
      const accessToken = generateAccessToken(
        user.data.id,
        user.data.email,
        user.data.name,
        user.data.role
      );
      return res.status(200).json({ accessToken });
    });
  },
  getProfile: async (req, res) => {
    const user = await accountService.findAccount(req);
    return res.send({ user });
  },
};
