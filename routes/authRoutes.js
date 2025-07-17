const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const {
  registerValidator,
  loginValidator,
  updateValidator,
  changePassValidator,
} = require("../validators/authValidator");
const { validateRequest } = require("../middleware/validateRequest");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post(
  "/register",
  registerValidator,
  validateRequest,
  authControllers.Register
);
router.post("/login", loginValidator, validateRequest, authControllers.Login);

router.get("/profile/user", authMiddleware, authControllers.profile);
router.put(
  "/update/profile/user",
  authMiddleware,
  updateValidator,
  validateRequest,
  authControllers.updateProfile
);

router.put(
  "/change-password/user",
  authMiddleware,
  changePassValidator,
  validateRequest,
  authControllers.changePass
);

module.exports = router;
