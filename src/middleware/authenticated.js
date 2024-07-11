const jwt = require("jsonwebtoken");
const { getHeaderToken } = require("../utils");
let refreshTokens = [];
const authRefreshToken = (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { email: user.email, name: user.name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken: accessToken });
  });
};
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
module.exports = { authenticateToken };
