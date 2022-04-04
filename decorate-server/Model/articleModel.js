const DB = require('../config/dbconfig')
const Sequelize = require('sequelize');

const articleModel = DB.define('article', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    cate: {
        type: Sequelize.STRING,
        allowNull: false
    },
    desc: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    cover: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updated_at: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = articleModel;