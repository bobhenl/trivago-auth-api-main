const express = require("express");
const router = express.Router();
const { verifyCookieToken } = require("../../middlewares/verifyToken");
const userController = require("../../controllers/user");

// Route to fetch user data (requires JWT token)
router.get("/", verifyCookieToken, userController.getUserData);

module.exports = router;
