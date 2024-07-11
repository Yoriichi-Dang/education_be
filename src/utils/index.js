const jwt = require("jsonwebtoken");
function decodeToken(token) {
  const decodeToken = jwt.decode(token);
  return decodeToken.data;
}
function getHeaderToken(req) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  return token;
}
function generateAccessToken(id, email, fullName, role) {
  const accessToken = jwt.sign(
    {
      data: { id: id, email, name: fullName, role: role },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_EXPIRES_TIME }
  );
  return accessToken;
}
function generateRefreshToken(id, email, fullName, role) {
  const refreshToken = jwt.sign(
    {
      data: { id: id, email: email, name: fullName, role: role },
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_EXPIRES_TIME,
    }
  );
  return refreshToken;
}

function getNewRefreshToken(oldRefreshToken) {
  const secretKey = process.env.REFRESH_TOKEN_SECRET;
  const decoded = jwt.decode(oldRefreshToken);
  if (!decoded || !decoded.exp) {
    throw new Error("Invalid token");
  }
  const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại tính bằng giây
  const remainingTime = decoded.exp - currentTime;
  if (remainingTime <= 0) {
    throw new Error("Token expired");
  }
  const newRefreshToken = jwt.sign({ data: decoded.data }, secretKey, {
    expiresIn: remainingTime,
  });
  return newRefreshToken;
}
module.exports = {
  generateAccessToken,
  generateRefreshToken,
  decodeToken,
  getNewRefreshToken,
  getHeaderToken,
};
