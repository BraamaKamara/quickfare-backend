require('dotenv').config();
const { parse } = require('pg-connection-string');

// Parse the DATABASE_URL
const dbUrl = process.env.DATABASE_URL;
const config = dbUrl ? parse(dbUrl) : {};

module.exports = {
  development: {
    username: config.user || process.env.DB_USER,
    password: config.password || process.env.DB_PASSWORD,
    database: config.database || process.env.DB_NAME,
    host: config.host || process.env.DB_HOST,
    port: config.port || process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      connectTimeout: 10000
    }
  },
  test: {
    username: config.user || process.env.DB_USER,
    password: config.password || process.env.DB_PASSWORD,
    database: config.database || process.env.DB_NAME,
    host: config.host || process.env.DB_HOST,
    port: config.port || process.env.DB_PORT || 5432,
    dialect: 'postgres'
  },
  production: {
    username: config.user || process.env.DB_USER,
    password: config.password || process.env.DB_PASSWORD,
    database: config.database || process.env.DB_NAME,
    host: config.host || process.env.DB_HOST,
    port: config.port || process.env.DB_PORT || 5432,
    dialect: 'postgres'
  }
};
