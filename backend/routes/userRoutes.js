const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { protect, restrictTo } = require("../middleware/authMiddleware");


//router.post("/register", userController.register);
router.post("/register",protect, restrictTo("admin"),userController.register);
router.post("/login", userController.login);
router.get('/me', protect , userController.getMe);
router.patch('/:id', protect, restrictTo('admin'), userController.updateUser);
router.patch('/:id/deactivate', protect, restrictTo('admin'), userController.deactivateUser);

module.exports = router;