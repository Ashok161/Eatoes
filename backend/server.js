const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser'); // Or use express.json()
const { connectDBMongo, connectDBPostgres, getSequelizeInstance } = require('./config/db');

// Load env vars
dotenv.config(); // Make sure this is called before using process.env

// --- Connect to Databases ---
connectDBMongo(); // Connect to MongoDB
connectDBPostgres().then(() => {
     // --- Sync PostgreSQL Models (Optional but helpful for setup) ---
    // Place this *after* connectDBPostgres resolves and *before* starting the server
    const Order = require('./models/postgres/Order'); // Import model here
    const sequelize = getSequelizeInstance(); // Get the instance
    sequelize.sync({ alter: true }) // Use alter: true to avoid dropping tables
         .then(() => console.log('PostgreSQL tables synced successfully.'))
         .catch(err => console.error('Error syncing PostgreSQL tables:', err));
}); // Connect to PostgreSQL and sync models


// --- Route Files ---
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// --- Middleware ---
// CORS - Allow requests from your frontend
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Default was 3000
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(bodyParser.json()); // Handles JSON request bodies
// Or use the built-in Express middleware: app.use(express.json());

// --- Mount Routers ---
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// --- Basic Error Handling Middleware (Example - place after routes) ---
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});


// --- Server Initialization ---
const PORT = process.env.PORT || 5001; // Use port from .env or default

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});