const Sequelize = require("sequelize");

const sequelize = require("../Utils/database");

const archievedChat = sequelize.define("archievedChat",{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    message: Sequelize.STRING,
    fileUrl: Sequelize.STRING,
    userId: Sequelize.INTEGER,
    groupId: Sequelize.INTEGER
})

module.exports = archievedChat;