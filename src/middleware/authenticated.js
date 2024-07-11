const jwt = require("jsonwebtoken");
const { getHeaderToken } = require("../utils");
let refreshTokens = [];

const authenticateToken = (req, res, next) => {
  const token = getHeaderToken(req);
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
    if (err) {
      return res.sendStatus(403);
    }
    next();
  });
};
const protectRoutes = (req, res, next) => {
  const token = getHeaderToken(req);
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    if (user.data.role == "user")
      return res.status(403).json({ message: "Not permision" });
    next();
  });
};
module.exports = { authenticateToken, protectRoutes };
