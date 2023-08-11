const Sequelize = require("sequelize");

const sequelize = require("../Utils/database");

const admin = sequelize.define("admin",{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    adminId:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    groupId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = admin;