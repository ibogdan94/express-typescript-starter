import Sequelize from 'sequelize';

const dbConfig = require('./../../database.json')[process.env.NODE_ENV as string];

export const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    dialect: dbConfig.dialect,
    host: dbConfig.host,
    logging: process.env.NODE_ENV !== "production",
    operatorsAliases: false
});

sequelize.authenticate();