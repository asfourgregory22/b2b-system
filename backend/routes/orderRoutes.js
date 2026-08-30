const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post('/', protect, restrictTo('admin', 'salesman', 'general_manager'), orderController.submitOrder);
router.post('/mine', protect, restrictTo('admin' ,"customer"), orderController.submitOwnOrder);

router.get('/mine', protect, restrictTo('customer'), orderController.getMyOwnOrders);
router.get('/', protect, restrictTo('admin', 'salesman', 'general_manager', 'accountant', 'stock_manager'), orderController.getMyOrders);
router.get('/:id', protect, orderController.getOrder);

router.patch('/:id/approve', protect, restrictTo('admin', 'general_manager'), orderController.approveOrder);
router.patch('/:id/reject', protect, restrictTo('admin', 'general_manager'), orderController.rejectOrder);
router.patch('/:id/status', protect, restrictTo('admin', 'stock_manager','general_manager'), orderController.updatedOrderStatus);

module.exports = router;