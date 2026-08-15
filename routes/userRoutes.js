const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { protect, restrictTo } = require("../middleware/authMiddleware");


//router.post("/register", userController.register);
router.post("/register",protect, restrictTo("admin"),userController.register);
router.post("/login", userController.login);
router.get('/me', protect , userController.getMe);

module.exports = router;