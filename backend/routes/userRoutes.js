const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post("/login", userController.login);

router.use(protect);

router.get('/me', userController.getMe);

router.post("/register", restrictTo("admin", "general_manager"), userController.register);
router.patch('/:id', restrictTo("admin", "general_manager"), userController.updateUser);
router.patch('/:id/deactivate', restrictTo("admin", "general_manager"), userController.deactivateUser);
router.patch('/:id/reset-password', restrictTo("admin", "general_manager"), userController.resetPassword);
router.patch('/:id/assign-salesman', restrictTo("admin", "general_manager"), userController.assignSalesman);

router.post('/customers', restrictTo("admin", "general_manager"), userController.createCustomer);

router.get('/', restrictTo('admin', 'general_manager', 'accountant', 'salesman'), userController.getAllUsers);
router.get('/:id', restrictTo('admin', 'general_manager', 'accountant', 'salesman'), userController.getUser);

module.exports = router;