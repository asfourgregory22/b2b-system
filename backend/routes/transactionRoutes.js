const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post('/', protect, restrictTo('admin', 'accountant'), transactionController.recordPayment);
router.get('/mine', protect, restrictTo('admin',"customer"), transactionController.getMyStatement);
router.get('/:customerId', protect, restrictTo('admin', 'accountant', 'salesman', 'general_manager'), transactionController.getCustomerStatement);


module.exports = router;