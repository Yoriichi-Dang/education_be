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
function generateToken(id, email, fullName) {
  const accessToken = jwt.sign(
    {
      data: { id: id, email, name: fullName },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30s" }
  );
  const refreshToken = jwt.sign(
    {
      data: { id: id, email: email, name: fullName },
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "2d",
    }
  );
  return { accessToken, refreshToken };
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
  generateToken,
  decodeToken,
  getNewRefreshToken,
  getHeaderToken,
};
