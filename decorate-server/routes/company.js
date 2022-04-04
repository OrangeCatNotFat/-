// 公司管理页面

var express=require('express');
var router=express.Router();
const Company=require('../model/companyModel')
/*
 增加 http://localhost:8089/company/add
 */
router.post('/add',(req,res)=>{
    let cmp=req.body.cmp;

    Company.create({
        company_name:cmp.company_name,
        company_address:cmp.company_address,
        company_phone:cmp.company_phone,
        company_intro:cmp.company_intro,
        longitude:cmp.longitude,
        latitude:cmp.latitude,
        created_at:cmp.created_at,
        updated_at:cmp.updated_at


    }).then(result=>{
        res.json({
            code:1000,
            msg:'保存成功'
        })
    }).catch(err=>{
        console.log(err)
    })
    }
  )

module.exports=router;