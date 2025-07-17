const express = require("express");
const Router = express.Router();
const {
  addBalance,
  updateRekening,
  showBalance,
  getAllRekening,
  getRekeningByID,
} = require("../controllers/rekeningControllers");
const { rekeningValidator } = require("../validators/rekeningValidator");
const { validateRequest } = require("../middleware/validateRequest");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getAllExpenditure,
  getAllIncome,
} = require("../controllers/transactionsController");

Router.post(
  "/add-bank/rekening",
  authMiddleware, // harus validasi token dulu
  rekeningValidator, // validasi field
  validateRequest, // cek hasil validasi
  addBalance // panggil controller
);

Router.put(
  "/update-balance/rekening/:id",
  authMiddleware,
  rekeningValidator,
  validateRequest,
  updateRekening
);

Router.get("/show-balance/rekening", authMiddleware, showBalance);
Router.get("/get-rekening/rekening", authMiddleware, getAllRekening);
Router.get("/get-rekening-income/rekening", authMiddleware, getAllIncome);
Router.get(
  "/get-rekening-expenditure/rekening",
  authMiddleware,
  getAllExpenditure
);

Router.get("/get-rekening/:id", authMiddleware, getRekeningByID);

module.exports = Router;
