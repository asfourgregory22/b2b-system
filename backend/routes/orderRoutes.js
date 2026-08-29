const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

<<<<<<< HEAD
router.use(protect);

router.get('/', restrictTo('admin', 'general_manager', 'accountant', 'stock_manager'), orderController.getAllOrders);

router.get('/sales', restrictTo('salesman'), orderController.getMyOrders);

router.post('/mine', restrictTo('customer'), orderController.submitOwnOrder);
router.get('/mine', restrictTo('customer'), orderController.getMyOwnOrders);

router.post('/', restrictTo('admin', 'general_manager', 'salesman'), orderController.submitOrder);

router.get('/:id', restrictTo('admin', 'general_manager', 'stock_manager', 'accountant', 'salesman'), orderController.getOrder);

router.patch('/:id/approve', restrictTo('admin', 'general_manager'), orderController.approveOrder);
router.patch('/:id/reject', restrictTo('admin', 'general_manager'), orderController.rejectOrder);

router.patch('/:id/status', restrictTo('admin', 'general_manager'), orderController.updateOrderStatus);
=======
router.post('/', protect, restrictTo('admin', 'salesman', 'general_manager'), orderController.submitOrder);
router.post('/mine', protect, restrictTo('admin' ,"customer"), orderController.submitOwnOrder);

router.get('/mine', protect, restrictTo('admin' ,"customer"), orderController.getMyOwnOrders);
router.get('/', protect, restrictTo('admin' , 'salesman'), orderController.getMyOrders);
router.get('/:id', protect, orderController.getOrder);

router.patch('/:id/approve', protect, restrictTo('admin', 'general_manager'), orderController.approveOrder);
router.patch('/:id/reject', protect, restrictTo('admin', 'general_manager'), orderController.rejectOrder);
router.patch('/:id/status', protect, restrictTo('admin', 'stock_manager','general_manager'), orderController.updatedOrderStatus);
>>>>>>> temp-fix

module.exports = router;