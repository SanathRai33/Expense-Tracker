require('dotenv').config();

const { Sequelize } = require('sequelize');
const logger = require('./logger');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql'
    }
);

( async () => {
    try{
        await sequelize.authenticate();
        logger.info('Connection to MySQL has been created successfully');
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
    }
})();

module.exports = sequelize;