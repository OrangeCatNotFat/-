const express = require("express");
const router = express.Router();
const eventModel = require("../Model/eventModel");
const path = require("path");
const fs = require("fs");
const Op = require("sequelize").Op;

const multiparty = require("connect-multiparty"); // 导入上传中间件
const multipartyMiddleWare = multiparty(); // 创建上传中间件对象

// 图片上传接口：http://localhost:8089/events/upload
router.post("/upload", multipartyMiddleWare, (req, res) => {
    // 获取上传文件，photoContent是在前端定义好的
    let file = req.files.photoContent;
    // 定义上传文件的保存位置
    let des_file = path.join(__dirname + "../../../public/images") + "\\" + file.originalFilename;
    // 将临时文件中的数据拷贝到保存位置
    fs.readFile(file.path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if (err) {
                console.log(err);
                res.json({
                    status: 422,
                    msg: "写入文件失败"
                })
            }
        })
    })
    // 将上传图片的存储路径响应给客户端
    res.json({
        status: 201,
        msg: "上传图片成功",
        imgPath: `http://localhost:8089/images/${file.originalFilename}`
    })
})

// 查询所有信息：http://localhost:8089/events/all
router.get("/all", (req, res) => {
    eventModel.findAll({
        raw: true
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

// 添加信息：http://localhost:8089/events/add
router.post("/add", (req, res) => {
    let event = req.body.event; // 从前端接收到打包好的对象
    eventModel.create({
        id: event.id,
        name: event.name,
        img: event.img,
        article_id: event.article_id,
        url: event.url,
        created_at: event.created_at,
        updated_at: event.updated_at
    }).then(result => {
        res.json({
            status: 201,
            msg: "添加信息成功"
        })
    }).catch(err => {
        console.log(err);
    })
})

// 删除信息：http://localhost:8089/events/delete
router.delete("/delete", (req, res) => {
    eventModel.destroy({
        where: {
            id: req.body.id
        }
    }).then(result => {
        res.json({
            status: 204,
            msg: "删除成功"
        })
    })
})

// 批量删除：http://localhost:8089/events/batch
router.delete("/batch", (req, res) => {
    let id_arr = req.body.ids; // 接收前端的id的数组
    eventModel.destroy({
        where: {
            id: {
                [Op.in]: id_arr
            }
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

// 更新信息：http://localhost:8089/events/modify
router.put("/modify", (req, res) => {
    let event = req.body.event; // 接收从前端打包的对象类型的数据
    eventModel.findOne({
        where: {
            id: event.id
        }
    }).then(info => {
        info.update({
            name: event.name,
            img: event.img,
            article_id: event.article_id,
            url: event.url,
            updated_at: event.updated_at
        }).then(result => {
            res.json({
                status: 201,
                msg: "修改信息成功"
            })
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
})

// 查询某个活动：http://localhost:8089/events/one
router.get("/one", (req, res) => {
    let name = req.query.name;
    eventModel.findOne({
        where: {
            name: name
        }
    }).then(result => {
        res.json({
            status: 200,
            msg: "查找成功",
            data: result
        })
    }).catch(err => {
        console.log(err);
    })
})

module.exports = router;