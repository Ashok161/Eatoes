const express = require('express');
const {
    getMenuItems,
    getMenuItemById,
    createMenuItem, // Example admin route
    updateMenuItem, // Example admin route
    deleteMenuItem  // Example admin route
 } = require('../controllers/menuController');

const router = express.Router();

// Public routes
router.route('/')
    .get(getMenuItems)
    .post(createMenuItem); // Add POST for creating items (for testing/admin)

router.route('/:id')
    .get(getMenuItemById) // Get single item
    .put(updateMenuItem)   // Update item (for testing/admin)
    .delete(deleteMenuItem); // Delete item (for testing/admin)


module.exports = router;