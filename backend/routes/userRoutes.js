const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

//router.post("/register", userController.register);
router.post("/register", protect, restrictTo("admin", "general_manager"), userController.register);
router.post("/login", userController.login);

router.get('/', protect, restrictTo('admin', 'general_manager', 'stock_manager', 'accountant', 'salesman'), userController.getAllUsers);
router.get('/me', protect, restrictTo('admin', 'accountant', 'general_manager'), userController.getMe);
router.get('/:id', protect, restrictTo('admin', 'general_manager', 'accountant', 'salesman', 'stock_manager'), userController.getUser);

router.patch('/:id', protect, restrictTo('admin', 'general_manager'), userController.updateUser);
router.patch('/:id/deactivate', protect, restrictTo('admin', 'general_manager'), userController.deactivateUser);
router.patch('/:id/reset-password', protect, restrictTo('admin'), userController.resetPassword);

router.post('/customers', protect, restrictTo('admin', 'general_manager'), userController.createCustomer);

router.patch('/:id/assign-salesman', protect, restrictTo('admin', 'general_manager'), userController.assignSalesman);

module.exports = router;