const express = require("express");
const router = express.Router();
const orderModel = require("../Model/orderModel");

// 查询所有预约信息：http://localhost:8089/orders/all
router.get("/all", (req, res) => {
    orderModel.findAll({
        raw: false
    }).then(result => {
        res.json({
            status: 200,
            msg: "查询成功",
            data: result
        })
    }).catch(err => {
        console.log(err);
    })
})

// 添加预约信息：http://localhost:8089/orders/add
router.post("/add", (req, res) => {
    orderModel.create({
        id: null,
        name: req.body.name,
        phone: req.body.phone,
        type: req.body.type,
        order_date: req.body.order_date,
        message: req.body.message,
        status: req.body.status,
        created_at: req.body.created_at,
        updated_at: req.body.updated_at
    }).then(result => {
        res.json({
            code: 201,
            msg: "订单创建成功",
            data: result
        })
    }).catch(err => {
        console.log(err);
    })
})

// 查找订单信息：http://localhost:8089/orders/one
router.get("/one", (req, res) => {
    orderModel.findOne({
        where: {
            name: req.query.name
        }
    }).then(result => {
        res.json({
            status: 200,
            msg: "查询成功",
            data: result
        })
    }).catch(err => {
        console.log(err);
    })
})

// 修改订单信息：http://localhost:8089/orders/modify
router.put("/modify", (req, res) => {
    orderModel.findOne({
        where: {
            id: req.body.id
        }
    }).then((person) => {
        person.update({
            name: req.body.name,
            phone: req.body.phone,
            type: req.body.type,
            message: req.body.message,
            status: req.body.status,
            updated_at: req.body.updated_at
        }).then(result => {
            res.json({
                status: 201,
                msg: "更新成功",
                data: result
            })
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
})

// 删除订单信息：http://localhost:8089/orders/delete
router.delete("/delete", (req, res) => {
    orderModel.destroy({
        where: {
            id: req.body.id
        }
    }).then(result => {
        res.json({
            status: 204,
            msg: "删除成功"
        })
    }).catch(err => {
        console.log(err);
    })
})

module.exports = router;