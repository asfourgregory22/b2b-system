const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const { protect, restrictTo, protectCustomer } = require("../middleware/authMiddleware");

router.post('/', protect, restrictTo('admin', 'salesman'), orderController.submitOrder);
router.patch('/:id/approve', protect, restrictTo('admin', 'stock_manager'), orderController.approveOrder);
router.patch('/:id/reject', protect, restrictTo('admin', 'stock_manager'), orderController.rejectOrder);
router.get('/', protect, restrictTo('admin', 'stock_manager', 'accountant', 'salesman'), orderController.getMyOrders);
router.get('/:id', protect, restrictTo('admin', 'stock_manager', 'accountant', 'salesman'), orderController.getOrder);
router.post('/mine', protectCustomer, orderController.submitOwnOrder);

module.exports = router;