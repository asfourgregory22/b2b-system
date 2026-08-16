const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");
const { protect , restrictTo } = require("../middleware/authMiddleware");

router.post('/', protect, restrictTo('admin','stock_manager'),itemController.createItem);
router.get('/', protect, itemController.getAllItems);
router.get('/:id', protect, itemController.getItem);
router.patch('/:id', protect, restrictTo('admin', 'stock_manager'), itemController.updateItem);
router.patch('/:id/deactivate', protect, restrictTo('admin', 'stock_manager'), itemController.deactivateItem);

module.exports = router;