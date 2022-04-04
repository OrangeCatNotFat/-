const Sequlize = require('sequelize')
const DB = require("../config/dbconfig");

const Admin = DB.define("admin", {
    id: {
        type: Sequlize.STRING,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: Sequlize.STRING,
        allowNull: false
    },
    password: {
        type: Sequlize.STRING,
        allowNull: false
    },
    name: {
        type: Sequlize.STRING,
        allowNull: false
    },
    role: {
        type: Sequlize.STRING,
        allowNull: false
    },
    last_login_at: {
        type: Sequlize.DATE,
        allowNull: true
    },
    created_at: {
        type: Sequlize.DATE,
        allowNull: true
    },
    updated_at: {
        type: Sequlize.DATE,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: false
})


module.exports = Admin;