const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const connectDBMongo = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI not found in environment variables.');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

let sequelize;
const connectDBPostgres = async () => {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL not found in environment variables.');
        }
        sequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect: 'postgres',
            logging: false, // Set to console.log to see SQL queries
             // Add SSL options if connecting to a cloud PostgreSQL instance that requires it
            // dialectOptions: {
            //   ssl: {
            //     require: true,
            //     rejectUnauthorized: false // Adjust as per your provider's requirements
            //   }
            // }
        });

        await sequelize.authenticate();
        console.log('PostgreSQL Connected...');

        // Optional: Sync models (creates tables if they don't exist)
        // Be cautious with { force: true } in production as it drops tables!
        // await sequelize.sync({ alter: true }); // alter: true tries to update tables non-destructively
        // console.log("PostgreSQL Models Synced.");

    } catch (err) {
        console.error('PostgreSQL Connection Error:', err.message);
        process.exit(1);
    }
};

const getSequelizeInstance = () => {
    if (!sequelize) {
        throw new Error("Sequelize instance has not been initialized. Call connectDBPostgres first.");
    }
    return sequelize;
}

module.exports = {
    connectDBMongo,
    connectDBPostgres,
    getSequelizeInstance
};