const DB = require("../config/dbconfig");
const Sequelize = require("sequelize");

const eventModel = DB.define("event", {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    name: {
        allowNull: false,
        type: Sequelize.STRING(20)
    },
    img: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    article_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    url: {
        type: Sequelize.STRING(255),
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

module.exports = eventModel;