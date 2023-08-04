const Sequelize = require("sequelize");

const sequelize = require("../Utils/database");

const UserDetail = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = UserDetail;