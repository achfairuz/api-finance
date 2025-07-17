const { body } = require("express-validator");

const rekeningValidator = [
  body("name_bank").notEmpty().withMessage("Nama bank wajib diisi"),
  body("balance").notEmpty().withMessage("Balance wajib diisi"),
];

module.exports = { rekeningValidator };
