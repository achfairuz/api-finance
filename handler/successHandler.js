// helpers/responseHandler.js

const successHandler = (
  res,
  message = "Berhasil memuat data",
  data = null,
  code = 200
) => {
  return res.status(code).json({
    status: "success",
    message,
    code,
    data,
  });
};

module.exports = { successHandler };
