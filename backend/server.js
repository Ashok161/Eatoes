const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDBMongo, connectDBPostgres, getSequelizeInstance } = require('./config/db');

// Load env vars
dotenv.config();

// --- Connect to Databases ---
connectDBMongo(); // Connect to MongoDB
connectDBPostgres().then(() => {
    const Order = require('./models/postgres/Order');
    const sequelize = getSequelizeInstance();
    console.log('Skipping Sequelize sync as orders table is manually created.');
}).catch(err => {
    console.error('PostgreSQL connection failed:', err);
    process.exit(1);
});

// --- Route Files ---
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// --- Middleware ---
// CORS
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.CLIENT_URL?.replace(/\/$/, '') || 'https://ashok-eatos.netlify.app',
            'http://localhost:5173',
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(cors(corsOptions));

// Body Parser
app.use(express.json());

// --- Health Check Endpoint ---
app.get('/health', async (req, res) => {
    try {
        await getSequelizeInstance().authenticate();
        res.status(200).json({ status: 'healthy', databases: { mongo: true, postgres: true } });
    } catch (error) {
        res.status(500).json({ status: 'unhealthy', error: error.message });
    }
});

// --- Mount Routers ---
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', { message: err.message, stack: err.stack, path: req.path });
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error',
        path: req.path,
    });
});

// --- Server Initialization ---
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});
