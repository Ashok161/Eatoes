const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');

const connectDBMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const connectDBPostgres = async () => {
    try {
        console.log('Attempting to connect to PostgreSQL with DATABASE_URL:', process.env.DATABASE_URL);
        const sequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
            logging: (msg) => console.log('Sequelize:', msg),
        });
        await sequelize.authenticate();
        console.log('PostgreSQL connected successfully.');
        return sequelize;
    } catch (error) {
        console.error('PostgreSQL connection error:', error);
        throw error;
    }
};

const getSequelizeInstance = () => {
    return new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        logging: (msg) => console.log('Sequelize:', msg),
    });
};

module.exports = { connectDBMongo, connectDBPostgres, getSequelizeInstance };
