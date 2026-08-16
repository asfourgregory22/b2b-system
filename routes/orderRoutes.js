const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post('/', protect, restrictTo('admin', 'salesman'), orderController.submitOrder);
router.patch('/:id/approve', protect, restrictTo('admin', 'stock_manager'), orderController.approveOrder);

module.exports = router;