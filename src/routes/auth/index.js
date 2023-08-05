const express = require("express");
const router = express.Router();
const passport = require("passport");
const { verifyBodyToken } = require("../../middlewares/verifyToken");
const authController = require("../../controllers/auth");
const { emailAndPassValidation, emailValidation } = require("../../validation");

// Route to check if provided email is in database
router.post("/", emailValidation(), authController.auth);

// Route for user registration
router.post("/register", emailAndPassValidation(), authController.register);

// Route for user login
router.post("/login", emailValidation(), authController.login);

// Route for forgot password
router.post(
  "/forgot-password",
  emailValidation(),
  authController.forgotPassword
);

// Route for change/reset password
router.post("/change-password", verifyBodyToken, authController.changePassword);

// Route for Google OAuth2 authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Route for handling the callback of Google OAuth2 authentication
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleCallback
);

// Route for user logout
router.post("/logout", authController.logout);

module.exports = router;
