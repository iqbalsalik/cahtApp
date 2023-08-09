const Sequelize = require("sequelize");

const sequelize = require("../Utils/database");

const group = sequelize.define("group",{
    id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    groupName:{
        type: Sequelize.STRING,
        allowNull: false
    },
    adminId:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = group;