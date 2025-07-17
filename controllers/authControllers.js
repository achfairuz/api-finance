const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { where, Op } = require("sequelize");
const { errorHandler } = require("../handler/errorHandler");
const { successHandler } = require("../handler/successHandler");
const messages = require("../constants/responseMessage");
require("dotenv").config();
const bcrypt = require("bcrypt");

const Register = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    const exist_email = await User.findOne({ where: { email: email } });
    if (exist_email) {
      return errorHandler(res, 400, "Email sudah terdaftar");
    }

    const exist_user = await User.findOne({ where: { username: username } });
    if (exist_user) {
      return errorHandler(res, 400, "Username sudah ada");
    }

    const hash_pass = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hash_pass,
    });

    return successHandler(
      res,
      messages.success201,
      {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
      201
    );
  } catch (err) {
    return errorHandler(res, 500, "Terjadi kesalahan pada server", err.message);
  }
};

const Login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return errorHandler(res, 401, "Username invalid");
    }

    const check_pass = await bcrypt.compare(password, user.password);
    if (!check_pass) {
      return errorHandler(res, 401, "Password is Wrong");
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return successHandler(res, messages.success200, {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      token: token,
    });
  } catch (error) {
    return errorHandler(
      res,
      500,
      "Terjadi kesalahan pada server",
      error.message
    );
  }
};

const profile = async (req, res) => {
  const id_user = req.decoded.id;
  try {
    const exist_user = await User.findOne({ where: { id: id_user } });
    if (!exist_user) {
      return errorHandler(res, 404, "Data tidak ditemukan");
    }
    const showProfile = {
      id: exist_user.id,
      name: exist_user.name,
      email: exist_user.email,
      username: exist_user.username,
    };
    successHandler(res, messages.success200, showProfile, 200);
  } catch (error) {
    return errorHandler(res, 500, messages.error500, error.message);
  }
};

const updateProfile = async (req, res) => {
  const { name, username, email } = req.body;
  const user_id = req.decoded.id;
  try {
    const exist_user = await User.findOne({ where: { id: user_id } });
    if (!exist_user) {
      return errorHandler(res, 404, "Data tidak ditemukan");
    }

    const exist_username = await User.findOne({
      where: { username: username, id: { [Op.ne]: user_id } },
    });

    if (exist_username) {
      return errorHandler(res, 409, messages.error409);
    }

    const update = await User.update(
      {
        name: name,
        username: username,
        email: email,
      },
      { where: { id: exist_user.id } }
    );

    successHandler(res, "Data berjhasil di update", null, 200);
  } catch (error) {
    return errorHandler(res, 500, messages.error500, error.message);
  }
};

const changePass = async (req, res) => {
  const { old_pass, new_pass } = req.body;
  const user_id = req.decoded.id;
  try {
    const exist_user = await User.findOne({ where: { id: user_id } });
    if (!exist_user) {
      return errorHandler(res, 404, messages.error404);
    }
    const check_pass = await bcrypt.compare(old_pass, exist_user.password);
    if (!check_pass) {
      return errorHandler(res, 402, "Password is wrong");
    }
    const hash_new_pass = await bcrypt.hash(new_pass, 10);
    await User.update(
      {
        password: hash_new_pass,
      },
      { where: { id: exist_user.id } }
    );
    successHandler(res, "Change password successfull", (data = null), 200);
  } catch (error) {
    return errorHandler(res, 500, messages.error500, error.message);
  }
};

module.exports = { Register, Login, profile, updateProfile, changePass };
