// Import packages
const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize;

// Connects to Jaws DB if deployed on Heroku, 
// otherwise connects to local MySQL server using env variables
if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: 'localhost',
            dialect: 'mysql',
            port: 3306,
        },
    );
}
module.exports = sequelize;
