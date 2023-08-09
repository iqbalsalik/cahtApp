const Sequelize = require("sequelize");

const sequelize = require("../Utils/database");

const userGroup = sequelize.define("userGroup");

module.exports = userGroup;