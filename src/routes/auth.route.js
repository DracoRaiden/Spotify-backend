const express = require("express");
const authController = require("../controllers/auth.controller");
const validationMiddleware = require("../middlewares/validation.middleware");

const router = express.Router();

// We will have two routes: /register and /login
router.post(
  "/register",
  validationMiddleware.registerUserValidationRules,
  authController.registerUser,
);
router.post(
  "/login",
  validationMiddleware.loginUserValidationRules,
  authController.loginUser,
);

module.exports = router;
