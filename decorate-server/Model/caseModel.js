const DB = require("../config/dbconfig");
const Sequelize = require("sequelize");

const caseModel = DB.define("case", {
    id: { // 案例id
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    name: { // 案例名称
        type: Sequelize.STRING(30),
        allowNull: false
    },
    img: {//图片
        type: Sequelize.STRING(255),
        allowNull: false
    },
    desc: { // 摘要
        type: Sequelize.STRING(20),
        allowNull: false
    },
    content: { // 内容
        type: Sequelize.TEXT,
        allowNull: false
    },
    created_at: { // 创建时间
        type: Sequelize.DATE,
        allowNull: false
    },
    updated_at: { // 更新时间
        type: Sequelize.DATE,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = caseModel;