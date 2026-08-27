const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post('/', protect, restrictTo('admin', 'salesman'), orderController.submitOrder);
router.post('/mine', protect, restrictTo("customer"), orderController.submitOwnOrder);

router.get('/mine', protect, restrictTo("customer"), orderController.getMyOwnOrders);
router.get('/', protect, restrictTo('admin', 'stock_manager', 'accountant', 'salesman'), orderController.getMyOrders);
router.get('/:id', protect, restrictTo('admin', 'stock_manager', 'accountant', 'salesman'), orderController.getOrder);

router.patch('/:id/approve', protect, restrictTo('admin', 'general_manager'), orderController.approveOrder);
router.patch('/:id/reject', protect, restrictTo('admin', 'general_manager'), orderController.rejectOrder);
router.patch('/:id/status', protect, restrictTo('admin', 'general_manager'), orderController.updatedOrderStatus);

module.exports = router;