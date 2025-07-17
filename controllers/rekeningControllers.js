const { rekening } = require("../models");
const { errorHandler } = require("../handler/errorHandler");
const { successHandler } = require("../handler/successHandler");
const { where } = require("sequelize");
const messages = require("../constants/responseMessage");
const { Op } = require("sequelize");

const addBalance = async (req, res) => {
  const { name_bank, balance } = req.body;
  const id_user = req.decoded.id;
  try {
    const exist_bank = await rekening.findOne({
      where: {
        name_bank: {
          [Op.iLike]: name_bank,
        },
        user_id: id_user,
        tipe: "personal",
      },
    });

    if (exist_bank) {
      return errorHandler(
        res,
        400,
        messages.error400,
        `${name_bank} sudah ada`
      );
    }

    const create = await rekening.create({
      user_id: id_user,
      name_bank: name_bank,
      balance: balance,
    });

    successHandler(res, messages.success201, create, 201);
  } catch (error) {
    errorHandler(res, 500, messages.error500, error);
  }
};

const updateRekening = async (req, res) => {
  const { id } = req.params;
  const { name_bank, balance } = req.body;
  const user_id = req.decoded.id;

  try {
    const exist_bank = await rekening.findOne({ where: { id } });
    if (!exist_bank) {
      return errorHandler(
        res,
        404,
        messages.error404,
        `ID ${id} tidak ditemukan`
      );
    }

    await rekening.update(
      {
        name_bank: name_bank,
        balance: balance,
        user_id: user_id,
      },
      { where: { id } }
    );
    successHandler(res, messages.success200, (data = null), 200);
  } catch (error) {
    return errorHandler(res, 500, messages.error500, error);
  }
};

const showBalance = async (req, res) => {
  const user_id = req.decoded.id;
  try {
    const exist_rekening = await rekening.findAll({
      where: { user_id: user_id },
    });

    if (!exist_rekening) {
      return errorHandler(res, 404, "Silahkan buat rekening terlebih dahulu");
    }

    let totalBalance = exist_rekening.reduce((total, rek) => {
      return total + parseFloat(rek.balance);
    }, 0);

    successHandler(res, messages.success200, totalBalance, 200);
  } catch (error) {
    return errorHandler(res, 500, messages.error500, error);
  }
};

const getAllRekening = async (req, res) => {
  const user_id = req.decoded.id;
  try {
    const exist_rekening = await rekening.findAll({
      where: {
        user_id: user_id,
      },
    });

    if (!exist_rekening || exist_rekening.length == 0) {
      return errorHandler(
        res,
        404,
        "Rekening tidak ada, silahkan buat rekening atau isi saldo terlebih dahulu"
      );
    }
    successHandler(res, messages.success200, exist_rekening, 200);
  } catch (error) {
    return errorHandler(res, 500, messages.error500, error.messages);
  }
};

const getRekeningByID = async (req, res) => {
  const { id } = req.params;

  const user_id = req.decoded.id;
  try {
    const exist_rekening = await rekening.findOne({
      where: { id, user_id },
    });
    if (!exist_rekening) {
      return errorHandler(res, 404, "Rekening not found");
    }

    successHandler(res, messages.success200, exist_rekening, 200);
  } catch (error) {
    errorHandler(res, 500, messages.error500, error.message);
  }
};

module.exports = {
  addBalance,
  updateRekening,
  showBalance,
  getAllRekening,
  getRekeningByID,
};
