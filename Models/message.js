const Sequelize = require("sequelize");

const sequelize = require("../Utils/database");

const message = sequelize.define("message",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    message: Sequelize.STRING
})

module.exports = message;