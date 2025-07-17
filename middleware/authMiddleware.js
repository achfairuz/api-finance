const jwt = require("jsonwebtoken");
const { errorHandler } = require("../handler/errorHandler");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return errorHandler(res, 401, "Token tidak ditemukan (Unauthorized)");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return errorHandler(res, 403, "Token tidak valid (Forbidden)");
      }

      req.decoded = decoded;
      next();
    });
  } catch (err) {
    return errorHandler(
      res,
      500,
      "Terjadi kesalahan pada middleware",
      err.message
    );
  }
};

module.exports = { authMiddleware };
