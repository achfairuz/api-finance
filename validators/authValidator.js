const { body } = require("express-validator");

const registerValidator = [
  body("name").notEmpty().withMessage("Nama wajib diisi"),
  body("username").notEmpty().withMessage("Username wajib diisi"),
  body("email").isEmail().withMessage("Format email tidak valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
];

const loginValidator = [
  body("username").notEmpty().withMessage("Username wajib diisi"),
  body("password").notEmpty().withMessage("Password wajib diisi"),
];

const updateValidator = [
  body("name").notEmpty().withMessage("Name wajib diisi"),
  body("username").notEmpty().withMessage("Username wajib diisi"),
  body("email")
    .isEmail()
    .withMessage("Format email tidak valid")
    .notEmpty()
    .withMessage("Email wajib diisi"),
];

const changePassValidator = [
  body("old_pass")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
  body("new_pass")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
];

module.exports = {
  registerValidator,
  loginValidator,
  updateValidator,
  changePassValidator,
};
