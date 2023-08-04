const Sequelize = require("sequelize");

require("dotenv").config()

const sequelize = new Sequelize(process.env.SCHEMA_NAME,process.env.DB_USER_NAME,process.env.DB_PASSWORD,{
    dialect:"mysql",
    host:process.env.DB_HOST_NAME
})

module.exports = sequelize;

