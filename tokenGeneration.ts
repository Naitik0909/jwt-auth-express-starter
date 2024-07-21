const jwt = require("jsonwebtoken");

// accessTokens
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

// refreshTokens
const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "20m",
  });
  return refreshToken;
}

export {generateAccessToken, generateRefreshToken};