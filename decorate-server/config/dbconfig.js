const Sequelize = require("sequelize");

const DB = new Sequelize("decorate", "root", "123456", {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    pool: {
        max: 100,
        min: 0,
        idle: 100000
    },
    debug: true
})

module.exports = DB;