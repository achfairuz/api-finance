const errorHandler = (
  res,
  code = 500,
  message = "Terjadi kesalahan server",
  errors = null,
  data = null // ❗️Perbaikan: `data? = null` tidak valid di JavaScript
) => {
  return res.status(code).json({
    status: "error",
    message,
    code,
    error: errors,
    data, // tetap boleh dikirim kalau kamu butuh debug info
  });
};

module.exports = { errorHandler };
