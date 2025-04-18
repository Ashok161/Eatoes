const { DataTypes } = require('sequelize');
const { getSequelizeInstance } = require('../../config/db');

const sequelize = getSequelizeInstance(); // Get the initialized instance

const Order = sequelize.define('Order', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    customerPhone: {
        type: DataTypes.STRING,
        allowNull: false,
        // Optional: Add index for faster lookups by phone
        // indexes: [{ unique: false, fields: ['customerPhone'] }]
    },
    // Store cart items directly as JSONB for simplicity
    // Alternatively, create a separate OrderItem table and use associations
    cartItems: {
        type: DataTypes.JSONB, // Use JSONB for efficient querying in PG
        allowNull: false,
        defaultValue: [], // Default to an empty array
        // Example structure: [{ menuItemId: 'mongo_id_string', name: 'Burger', quantity: 1, price: 9.99 }, ...]
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2), // Store price precisely
        allowNull: false,
    },
    orderStatus: {
        type: DataTypes.STRING,
        defaultValue: 'Received', // e.g., Received, Preparing, Ready, Completed
        allowNull: false,
    }
    // timestamps: true is default in Sequelize (adds createdAt, updatedAt)
}, {
    // Other model options go here
    tableName: 'orders', // Optional: specify table name
    indexes: [
        // Add an index on customerPhone for faster lookup
        {
            fields: ['customerPhone']
        }
    ]
});

// Optional: If you want to run sync specifically for this model after connection
// (async () => {
//   await Order.sync({ alter: true });
//   console.log("The Order table was just (re)created!");
// })();

module.exports = Order;