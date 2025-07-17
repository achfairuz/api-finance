const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { transactionValidator } = require("../validators/transactionValidator");
const { validateRequest } = require("../middleware/validateRequest");
const {
  ExpenditureTransaction,
  incomeTransaction,
  getAllExpenditure,
  getAllTransaction,
  getId,
  updateTransaction,
  deleteTransaction,
  getTotalExpenditure,
  getTotalIncome,
} = require("../controllers/transactionsController");
const Router = express.Router();

// pengeluaran
Router.post(
  "/transaction/expenditure",
  authMiddleware,
  transactionValidator,
  validateRequest,
  ExpenditureTransaction
);

Router.post(
  "/transaction/income",
  authMiddleware,
  transactionValidator,
  validateRequest,
  incomeTransaction
);

Router.get(
  "/get-all-transaction/expenditure",
  authMiddleware,
  getAllExpenditure
);
Router.get("/get-all-transaction/income", authMiddleware, getAllExpenditure);
Router.get("/get-all-transaction", authMiddleware, getAllTransaction);
Router.get("/get-transaction/:id", authMiddleware, getId);
Router.get("/get-chart-expenditure", authMiddleware, getTotalExpenditure);
Router.get("/get-chart-income", authMiddleware, getTotalIncome);

Router.put(
  "/update-transaction/:id",
  authMiddleware,
  transactionValidator,
  validateRequest,
  updateTransaction
);

Router.delete("/delete-transaction/:id", authMiddleware, deleteTransaction);

module.exports = Router;
