const { rekening, Transaction } = require("../models");
const messages = require("../constants/responseMessage");
const { errorHandler } = require("../handler/errorHandler");
const { successHandler } = require("../handler/successHandler");
const { where, fn, col, literal } = require("sequelize");

/**
 * Create Transaction - Pengeluaran
 */
const ExpenditureTransaction = async (req, res) => {
  const { date, time, rekening_id, title, category, amount, information } =
    req.body;
  const user_id = req.decoded.id;

  try {
    if (!user_id) {
      return errorHandler(res, 400, "Silakan login terlebih dahulu");
    }

    const existRekening = await rekening.findOne({
      where: { id: rekening_id, user_id },
    });

    if (!existRekening) {
      return errorHandler(
        res,
        400,
        "Rekening tidak ditemukan. Tambahkan atau isi saldo terlebih dahulu."
      );
    }

    const newExpenditure = await Transaction.create({
      rekening_id,
      date,
      time,
      title,
      category,
      amount,
      information,
      type: "pengeluaran",
    });

    const newBalance = parseFloat(existRekening.balance) - parseFloat(amount);

    await rekening.update(
      { balance: newBalance },
      { where: { id: rekening_id } }
    );

    return successHandler(res, messages.success201, newExpenditure, 201);
  } catch (error) {
    console.error(error);
    return errorHandler(res, 500, messages.error500, error);
  }
};

/**
 * Create Transaction - Pemasukan
 */
const incomeTransaction = async (req, res) => {
  const { date, time, rekening_id, title, category, amount, information } =
    req.body;
  const user_id = req.decoded.id;

  try {
    if (!user_id) {
      return errorHandler(res, 400, "Silakan login terlebih dahulu");
    }

    const existRekening = await rekening.findOne({
      where: { id: rekening_id, user_id },
    });

    if (!existRekening) {
      return errorHandler(
        res,
        400,
        "Rekening tidak ditemukan. Tambahkan atau isi saldo terlebih dahulu."
      );
    }

    const newIncome = await Transaction.create({
      rekening_id,
      date,
      time,
      title,
      category,
      amount,
      information,
      type: "pemasukan",
    });

    const newBalance = parseFloat(existRekening.balance) + parseFloat(amount);

    await rekening.update(
      { balance: newBalance },
      { where: { id: rekening_id } }
    );

    return successHandler(res, messages.success201, newIncome, 201);
  } catch (error) {
    return errorHandler(res, 500, messages.error500, error);
  }
};

/**
 * Get All Transactions
 */
const getAllTransaction = async (req, res) => {
  const user_id = req.decoded.id;

  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: rekening,
          as: "rekening",
          attributes: ["id", "name_bank"],
          where: { user_id },
        },
      ],
    });

    if (!transactions || transactions.length === 0) {
      return errorHandler(res, 404, "Tidak ada transaksi");
    }

    return successHandler(res, messages.success200, transactions, 200);
  } catch (error) {
    return errorHandler(res, 500, messages.error500, error.message);
  }
};

/**
 * Get All Income Transactions
 */
const getAllIncome = async (req, res) => {
  const user_id = req.decoded.id;

  try {
    const transactions = await Transaction.findAll({
      where: { type: "pemasukan" },
      include: [
        {
          model: rekening,
          as: "rekening",
          attributes: ["id", "name_bank"],
          where: { user_id },
        },
      ],
    });

    if (!transactions || transactions.length === 0) {
      return errorHandler(res, 404, "Tidak ada transaksi pemasukan");
    }

    return successHandler(res, messages.success200, transactions, 200);
  } catch (error) {
    return errorHandler(res, 500, messages.error500, error.message);
  }
};

/**
 * Get All Expenditure Transactions
 */
const getAllExpenditure = async (req, res) => {
  const user_id = req.decoded.id;

  try {
    const transactions = await Transaction.findAll({
      where: { type: "pengeluaran" },
      include: [
        {
          model: rekening,
          as: "rekening",
          attributes: ["id", "name_bank"],
          where: { user_id },
        },
      ],
    });

    if (!transactions || transactions.length === 0) {
      return errorHandler(res, 404, "Tidak ada transaksi pengeluaran");
    }

    return successHandler(res, messages.success200, transactions, 200);
  } catch (error) {
    return errorHandler(res, 500, messages.error500, error.message);
  }
};

/**
 * Get Transaction by ID
 */
const getId = async (req, res) => {
  const { id } = req.params;
  const user_id = req.decoded.id;

  try {
    const transaction = await Transaction.findOne({
      where: { id },
      include: [
        {
          model: rekening,
          as: "rekening",
          attributes: ["id", "name_bank"],
          where: { user_id },
        },
      ],
    });

    if (!transaction) {
      return errorHandler(res, 404, "Transaksi tidak ditemukan");
    }

    return successHandler(res, messages.success200, transaction, 200);
  } catch (error) {
    return errorHandler(res, 500, messages.error500, error.message);
  }
};
const updateTransaction = async (req, res) => {
  const {
    date,
    time,
    rekening_id,
    title,
    category,
    amount,
    information,
    type,
  } = req.body;

  const { id } = req.params;
  const user_id = req.decoded.id;

  try {
    // Ambil data transaksi lama dan rekening lama
    const exist_transaction = await Transaction.findOne({
      where: { id },
      include: [
        {
          model: rekening,
          as: "rekening",
          attributes: ["id", "name_bank", "balance"],
          where: { user_id },
        },
      ],
    });

    if (!exist_transaction) {
      return errorHandler(res, 404, messages.error404);
    }

    // Data lama
    const oldAmount = parseFloat(exist_transaction.amount);
    const oldRekeningId = exist_transaction.rekening.id;
    let oldRekeningBalance = parseFloat(exist_transaction.rekening.balance);
    const newAmount = parseFloat(amount);

    // Validasi amount
    if (isNaN(newAmount) || newAmount < 0) {
      return errorHandler(res, 400, "Jumlah tidak valid");
    }

    // Perubahan saldo jika amount berubah dan rekening tetap
    if (rekening_id == oldRekeningId && newAmount !== oldAmount) {
      const selisih = Math.abs(newAmount - oldAmount);
      if (type === "pemasukan") {
        oldRekeningBalance =
          newAmount > oldAmount
            ? oldRekeningBalance + selisih
            : oldRekeningBalance - selisih;
      } else if (type === "pengeluaran") {
        oldRekeningBalance =
          newAmount > oldAmount
            ? oldRekeningBalance - selisih
            : oldRekeningBalance + selisih;
      }

      await rekening.update(
        { balance: oldRekeningBalance },
        { where: { id: oldRekeningId } }
      );
    }

    // Jika rekening berubah
    if (rekening_id != null && rekening_id !== oldRekeningId) {
      const newRekening = await rekening.findOne({
        where: { id: rekening_id, user_id },
      });

      if (!newRekening) {
        return errorHandler(res, 404, "Rekening baru tidak ditemukan");
      }

      let newRekeningBalance = parseFloat(newRekening.balance);

      // Kembalikan saldo ke rekening lama
      if (type === "pemasukan") {
        oldRekeningBalance -= oldAmount;
        newRekeningBalance += newAmount;
      } else if (type === "pengeluaran") {
        oldRekeningBalance += oldAmount;
        newRekeningBalance -= newAmount;
      }

      // Update saldo di rekening lama & baru
      await rekening.update(
        { balance: oldRekeningBalance },
        { where: { id: oldRekeningId } }
      );
      await rekening.update(
        { balance: newRekeningBalance },
        { where: { id: rekening_id } }
      );
    }

    // Update transaksi
    const updated = await Transaction.update(
      {
        date,
        time,
        rekening_id,
        title,
        category,
        amount: newAmount,
        information,
        type,
      },
      { where: { id } }
    );

    return successHandler(res, messages.success200, (data = null), 200);
  } catch (error) {
    return errorHandler(res, 500, messages.error500, error.message);
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const user_id = req.decoded.id;
  try {
    const exist_transaction = await Transaction.findOne({
      where: { id },
      include: [
        {
          model: rekening,
          as: "rekening",
          attributes: ["id", "name_bank", "balance"],
          where: { user_id },
        },
      ],
    });

    if (!exist_transaction) {
      return errorHandler(res, 404, messages.error404);
    }
    console.log(exist_transaction.rekening.balance);
    const OldBalanceRekening = parseFloat(exist_transaction.rekening.balance);
    const amountTransaction = parseFloat(exist_transaction.amount);
    const newBalanceRekening =
      exist_transaction.type == "pengeluaran"
        ? OldBalanceRekening + amountTransaction
        : OldBalanceRekening - amountTransaction;
    await rekening.update(
      {
        balance: newBalanceRekening,
      },
      {
        where: {
          id: exist_transaction.rekening.id,
        },
      }
    );
    await Transaction.destroy({
      where: { id: exist_transaction.id },
    });

    successHandler(res, "Data berhasil dihapus", (data = null), 200);
  } catch (error) {
    return errorHandler(res, 500, messages.error500, error.message);
  }
};

const getTotalExpenditure = async (req, res) => {
  const user_id = req.decoded.id;

  try {
    const exist_transaction = await Transaction.findAll({
      attributes: [
        [literal(`EXTRACT(YEAR FROM "Transaction"."date")`), "year"],
        [literal(`EXTRACT(MONTH FROM "Transaction"."date")`), "month"],
        [fn("SUM", col("amount")), "total_amount"],
      ],
      where: { type: "pengeluaran" },
      include: [
        {
          model: rekening,
          as: "rekening",
          attributes: [],
          where: { user_id },
        },
      ],
      group: [
        literal(`EXTRACT(YEAR FROM "Transaction"."date")`),
        literal(`EXTRACT(MONTH FROM "Transaction"."date")`),
      ],
      order: [
        literal(`EXTRACT(YEAR FROM "Transaction"."date") ASC`),
        literal(`EXTRACT(MONTH FROM "Transaction"."date") ASC`),
      ],
    });
    if (!exist_transaction || exist_transaction.length === 0) {
      return errorHandler(res, 404, "Transaction not found");
    }
    const formatted = {};
    const monthNames = [
      "",
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    exist_transaction.forEach((item) => {
      const year = item.get("year");
      const month = item.get("month");
      const total = parseFloat(item.get("total_amount"));
      const monthName = monthNames[month];
      if (!formatted[year]) {
        formatted[year] = [];
      }

      formatted[year].push({ month: monthName, amount: total });
    });

    successHandler(res, messages.success200, formatted, 200);
  } catch (error) {
    return errorHandler(res, 500, messages.error500, error.message);
  }
};

const getTotalIncome = async (req, res) => {
  const user_id = req.decoded.id;

  try {
    const exist_transaction = await Transaction.findAll({
      attributes: [
        [literal(`EXTRACT(YEAR FROM "Transaction"."date")`), "year"],
        [literal(`EXTRACT(MONTH FROM "Transaction"."date")`), "month"],
        [fn("SUM", col("amount")), "total_amount"],
      ],
      where: { type: "pemasukan" },
      include: [
        {
          model: rekening,
          as: "rekening",
          attributes: [],
          where: { user_id },
        },
      ],
      group: [
        literal(`EXTRACT(YEAR FROM "Transaction"."date")`),
        literal(`EXTRACT(MONTH FROM "Transaction"."date")`),
      ],
      order: [
        literal(`EXTRACT(YEAR FROM "Transaction"."date") ASC`),
        literal(`EXTRACT(MONTH FROM "Transaction"."date") ASC`),
      ],
    });
    if (!exist_transaction || exist_transaction.length === 0) {
      return errorHandler(res, 404, "Transaction not found");
    }
    const formatted = {};
    const monthNames = [
      "",
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    exist_transaction.forEach((item) => {
      const year = item.get("year");
      const month = item.get("month");
      const total = parseFloat(item.get("total_amount"));
      const monthName = monthNames[month];
      if (!formatted[year]) {
        formatted[year] = [];
      }

      formatted[year].push({ month: monthName, amount: total });
    });

    successHandler(res, messages.success200, formatted, 200);
  } catch (error) {
    return errorHandler(res, 500, messages.error500, error.message);
  }
};
module.exports = {
  ExpenditureTransaction,
  incomeTransaction,
  getAllTransaction,
  getAllIncome,
  getAllExpenditure,
  getId,
  updateTransaction,
  deleteTransaction,
  getTotalExpenditure,
  getTotalIncome,
};
