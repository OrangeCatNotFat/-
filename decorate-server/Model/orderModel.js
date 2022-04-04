const DB = require("../config/dbconfig");
const Sequelize = require("sequelize");

const orderModel = DB.define("order", {
    id: { // 主键id
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    name: { // 预约姓名
        type: Sequelize.STRING(30),
    },
    phone: { // 预约电话
        type: Sequelize.STRING(20),
    },
    type: { // 装饰类型
        type: Sequelize.STRING(20),
    },
    order_date: { // 预约日期
        type: Sequelize.DATE
    },
    message: { // 留言
        type: Sequelize.STRING(255),
    },
    status: { // 状态
        type: Sequelize.INTEGER
    },
    created_at: { // 创建时间
        type: Sequelize.DATE,
    },
    updated_at: { // 更新时间
        type: Sequelize.DATE,
    }
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = orderModel;