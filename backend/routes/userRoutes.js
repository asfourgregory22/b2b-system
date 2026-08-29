const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

<<<<<<< HEAD
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
=======
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
>>>>>>> temp-fix

module.exports = router;