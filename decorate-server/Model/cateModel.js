const DB = require("../config/dbconfig");
const Sequelize = require("sequelize");

const cateModel = DB.define("cate", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    img: {
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

module.exports = cateModel;