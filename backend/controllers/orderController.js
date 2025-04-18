const Order = require('../models/postgres/Order'); // Import Sequelize model
const MenuItem = require('../models/mongo/MenuItem'); // Needed to verify item details? Optional.

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res, next) => {
    try {
        const { customerName, customerPhone, cartItems } = req.body;

        // --- Basic Input Validation ---
        if (!customerName || !customerPhone || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ success: false, error: 'Missing required fields: customerName, customerPhone, and a non-empty cartItems array.' });
        }

        // --- Data Integrity/Calculation (Optional but recommended) ---
        // Ideally, recalculate total price on the backend based on current menu prices
        // This prevents users manipulating prices in the frontend request.
        let calculatedTotalPrice = 0;
        const validatedCartItems = [];

        for (const item of cartItems) {
            // Find the corresponding menu item in MongoDB to get the current price
            const menuItem = await MenuItem.findById(item.menuItemId); // Use the ID stored in cart item
            if (!menuItem) {
                 // If you want strict validation, uncomment the next line
                 // return res.status(400).json({ success: false, error: `Menu item with ID ${item.menuItemId} not found.` });
                 // Or proceed with the price sent from frontend (less secure)
                 console.warn(`Menu item ID ${item.menuItemId} not found, using price from request.`);
                 calculatedTotalPrice += (item.price * item.quantity);
                 validatedCartItems.push({
                     menuItemId: item.menuItemId, // Store the Mongo ID string
                     name: item.name,
                     quantity: item.quantity,
                     price: item.price // Use price from request if item not found
                 });
            } else {
                calculatedTotalPrice += (menuItem.price * item.quantity);
                validatedCartItems.push({
                    menuItemId: menuItem._id.toString(), // Store the Mongo ID string
                    name: menuItem.name,
                    quantity: item.quantity,
                    price: menuItem.price // Use the current price from DB
                });
            }
        }

         // Format total price to 2 decimal places
         calculatedTotalPrice = parseFloat(calculatedTotalPrice.toFixed(2));

        // --- Create Order in PostgreSQL ---
        const newOrder = await Order.create({
            customerName,
            customerPhone,
            cartItems: validatedCartItems, // Use the backend-validated/priced items
            totalPrice: calculatedTotalPrice, // Use backend-calculated price
            // orderStatus: 'Received' // Default value set in model
        });

        res.status(201).json({
            success: true,
            data: newOrder,
        });

    } catch (err) {
        console.error('Error creating order:', err);
         if (err.name === 'SequelizeValidationError') {
            const messages = err.errors.map(e => e.message);
            return res.status(400).json({ success: false, error: messages });
        }
        res.status(500).json({ success: false, error: 'Server Error while creating order' });
    }
};

// @desc    Get orders by customer phone number
// @route   GET /api/orders/:phone
// @access  Public (or protected if user accounts implemented)
exports.getOrdersByPhone = async (req, res, next) => {
    try {
        const customerPhone = req.params.phone;
        if (!customerPhone) {
             return res.status(400).json({ success: false, error: 'Phone number parameter is required.' });
        }

        const orders = await Order.findAll({
            where: {
                customerPhone: customerPhone,
            },
            order: [['createdAt', 'DESC']], // Show newest orders first
        });

        if (!orders || orders.length === 0) {
            // It's better to return an empty array than a 404 if the phone format is valid but no orders exist
             return res.status(200).json({
                success: true,
                count: 0,
                data: [], // Return empty array
            });
            // return res.status(404).json({ success: false, error: 'No orders found for this phone number.' });
        }

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });

    } catch (err) {
        console.error('Error fetching orders by phone:', err);
        res.status(500).json({ success: false, error: 'Server Error while fetching orders' });
    }
};