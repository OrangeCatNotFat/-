const Sequelize =require('sequelize');
const DB=require('../config/dbconfig');

const Company=DB.define('company',{
        id:{
            type:Sequelize.STRING,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        name:{
            type:Sequelize.STRING,
        },
        address:{
            type:Sequelize.STRING
        },
        tel:{
            type:Sequelize.STRING
        },
        intro:{
            type:Sequelize.TEXT
        },
        longitude:{
            type:Sequelize.DECIMAL
        },
        created_at:{
            type:Sequelize.DATE
        },
        updated_at:{
            type:Sequelize.DATE
        }
    },{
    freezeTableName: true,
    timestamps: false
    }
)
module.exports=Company;