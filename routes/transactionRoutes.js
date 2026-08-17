const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionController");
const { protect, restrictTo, protectCustomer } = require("../middleware/authMiddleware");

router.post('/', protect, restrictTo('admin', 'accountant'), transactionController.recordPayment);
router.get('/mine', protectCustomer, transactionController.getMyStatement);
router.get('/:customerId', protect, restrictTo('admin', 'accountant', 'salesman'), transactionController.getCustomerStatement);


module.exports = router;