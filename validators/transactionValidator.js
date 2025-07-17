const { body } = require("express-validator");

const transactionValidator = [
  body("date")
    .notEmpty()
    .withMessage("Tanggal wajib diisi")
    .isISO8601()
    .withMessage("Format tanggal tidak valid (contoh: YYYY-MM-DD)"),

  body("time")
    .notEmpty()
    .withMessage("Waktu wajib diisi")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
    .withMessage("Format waktu tidak valid (contoh: HH:MM atau HH:MM:SS)"),

  body("rekening_id")
    .notEmpty()
    .withMessage("Rekening ID wajib diisi")
    .isInt()
    .withMessage("Rekening ID harus berupa angka bulat"),

  body("title")
    .notEmpty()
    .withMessage("Judul wajib diisi")
    .isLength({ min: 3 })
    .withMessage("Judul minimal 3 karakter"),

  body("category").notEmpty().withMessage("Kategori wajib diisi"),

  body("amount")
    .notEmpty()
    .withMessage("Nominal wajib diisi")
    .isNumeric()
    .withMessage("Nominal harus berupa angka"),

  body("information")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Informasi maksimal 255 karakter"),
];

module.exports = { transactionValidator };
