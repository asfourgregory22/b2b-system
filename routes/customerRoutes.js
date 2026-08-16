const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customerController");
const { protect, restrictTo, protectCustomer } = require("../middleware/authMiddleware");

router.post('/register', customerController.registerCustomer);
router.post("/login", customerController.loginCustomer);
router.get("/me", protectCustomer, customerController.getMeCustomer);

router.patch('/:id/deactivate', protect, restrictTo('admin'), customerController.deactivateCustomer);
router.patch('/:id/assign-salesman', protect, restrictTo('admin'), customerController.assignSalesman);

module.exports = router;