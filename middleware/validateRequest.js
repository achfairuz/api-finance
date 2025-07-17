const { validationResult } = require("express-validator");
const { errorHandler } = require("../handler/errorHandler");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = {};
    errors.array().forEach((err) => {
      validationErrors[err.path] = err.msg; // GANTI dari param -> path
    });

    return errorHandler(res, 422, "Validasi gagal", validationErrors);
  }
  next();
};

module.exports = { validateRequest };
