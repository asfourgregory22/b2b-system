const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post('/', protect, restrictTo('admin', 'accountant'), transactionController.recordPayment);

module.exports = router;