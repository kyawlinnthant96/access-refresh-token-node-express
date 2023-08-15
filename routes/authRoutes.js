const express = require("express");
const authController = require("../controllers/authController");
const refreshTokenController = require("../controllers/refreshTokenController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.post("/", refreshTokenController.refreshToken);
router.delete("/", refreshTokenController.logout);

module.exports = router;
