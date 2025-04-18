const MenuItem = require('../models/mongo/MenuItem');

// @desc    Get all menu items (optionally by category)
// @route   GET /api/menu
// @access  Public
exports.getMenuItems = async (req, res, next) => {
    try {
        const query = {};
        if (req.query.category) {
            query.category = req.query.category;
        }
        const menuItems = await MenuItem.find(query);

        res.status(200).json({
            success: true,
            count: menuItems.length,
            data: menuItems,
        });
    } catch (err) {
         console.error("Error fetching menu items:", err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single menu item by ID (Example - might not be needed for this app)
// @route   GET /api/menu/:id
// @access  Public
exports.getMenuItemById = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({ success: false, error: 'Menu item not found' });
        }

        res.status(200).json({
            success: true,
            data: menuItem,
        });
    } catch (err) {
         console.error("Error fetching single menu item:", err);
         // Handle potential CastError if ID format is wrong
         if (err.name === 'CastError') {
             return res.status(400).json({ success: false, error: 'Invalid ID format' });
         }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


// --- Functions below are examples for potential Admin features ---
// --- Not required by core user functionality, test with Postman ---

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private (example - needs auth middleware in real app)
exports.createMenuItem = async (req, res, next) => {
     try {
         // Basic validation (more robust validation recommended)
         const { name, description, price, category } = req.body;
         if (!name || !description || !price || !category) {
              return res.status(400).json({ success: false, error: 'Please provide name, description, price, and category' });
         }

         const menuItem = await MenuItem.create(req.body);
         res.status(201).json({
              success: true,
              data: menuItem,
         });
     } catch (err) {
         console.error("Error creating menu item:", err);
         if (err.name === 'ValidationError') {
             const messages = Object.values(err.errors).map(val => val.message);
             return res.status(400).json({ success: false, error: messages });
         }
         res.status(500).json({ success: false, error: 'Server Error' });
     }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private (example)
exports.updateMenuItem = async (req, res, next) => {
    try {
        let menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({ success: false, error: 'Menu item not found' });
        }

         // Add validation for update data if needed

        menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the modified document
            runValidators: true, // Run schema validators on update
        });

        res.status(200).json({
            success: true,
            data: menuItem,
        });
    } catch (err) {
         console.error("Error updating menu item:", err);
         if (err.name === 'ValidationError') {
             const messages = Object.values(err.errors).map(val => val.message);
             return res.status(400).json({ success: false, error: messages });
         }
          if (err.name === 'CastError') {
             return res.status(400).json({ success: false, error: 'Invalid ID format' });
         }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private (example)
 exports.deleteMenuItem = async (req, res, next) => {
     try {
         const menuItem = await MenuItem.findById(req.params.id);

         if (!menuItem) {
             return res.status(404).json({ success: false, error: 'Menu item not found' });
         }

         await menuItem.deleteOne(); // Use deleteOne() or remove()

         res.status(200).json({
             success: true,
             data: {}, // Indicate successful deletion
         });
     } catch (err) {
         console.error("Error deleting menu item:", err);
          if (err.name === 'CastError') {
             return res.status(400).json({ success: false, error: 'Invalid ID format' });
         }
         res.status(500).json({ success: false, error: 'Server Error' });
     }
 };