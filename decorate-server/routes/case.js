const express = require("express");
const router = express.Router();
const caseModel = require("../Model/caseModel");
const path = require("path");
const fs = require("fs");
const Op = require("sequelize").Op;
const Format = require("../js/Format");

const multiparty = require("connect-multiparty"); // 导入上传中间件
const multipartyMiddleWare = multiparty(); // 创建上传中间件对象

// 图片上传接口：http://localhost:8089/case/upload
router.post("/upload", multipartyMiddleWare, (req, res) => {
    // 获取上传文件，photoContent是在前端定义好的
    let file = req.files.photoContent;
    // 定义上传文件的保存位置
    let des_file = path.join(__dirname, "../public/images") + "\\" + file.originalFilename;
    // 将临时文件中的数据拷贝到保存位置
    fs.readFile(file.path, function (err, data) { // data是文件的信息
        fs.writeFile(des_file, data, function (err) {
            if (err) {
                console.log(err);
                res.json({
                    status: 422,
                    msg: "写入文件失败"
                });
                return;
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

// 查询所有信息：http://localhost:8089/case/all
router.get("/all", (req, res) => {
    caseModel.findAll({
        raw: true
    }).then(result => {
        res.json({
            status: 200,
            msg: "查询成功",
            data: result.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    img: item.img,
                    desc: item.desc,
                    created_at: item.created_at.Format("yyyy-MM-dd hh:mm:ss"),
                    updated_at: item.updated_at.Format("yyyy-MM-dd hh:mm:ss")
                }
            })
        })
    }).catch(err => {
        console.log(err);
    })
})

// 添加信息：http://localhost:8089/case/add
router.post("/add", (req, res) => {
    let event = req.body.event; // 从前端接收到打包好的对象
    caseModel.create({
        id: null,
        name: event.name,
        img: event.img,
        desc: event.desc,
        content: event.content,
        created_at: new Date(),
        updated_at: new Date()
    }).then(result => {
        res.json({
            status: 201,
            msg: "添加信息成功"
        })
    }).catch(err => {
        console.log(err);
    })
})

// 删除信息：http://localhost:8089/case/delete
router.delete("/delete", (req, res) => {
    caseModel.destroy({
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

// 批量删除：http://localhost:8089/case/batch
router.delete("/batch", (req, res) => {
    let id_arr = req.body.ids; // 接收前端的id的数组
    caseModel.destroy({
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

// 更新信息：http://localhost:8089/case/modify
router.put("/modify", (req, res) => {
    let event = req.body.event; // 接收从前端打包的对象类型的数据
    caseModel.findOne({
        where: {
            id: event.id
        }
    }).then(info => {
        info.update({
            name: event.name,
            img: event.img,
            desc: event.desc,
            content: event.content,
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

// 搜索活动：http://localhost:8089/case/some
router.post("/some", (req, res) => {
    let name = req.body.name;
    caseModel.findAll({
        where: {
            name: {
                [Op.like]: "%" + name + "%" // 模糊查询
            }
        }
    }).then(result => {
        if (result !== null) {
            res.json({
                status: 200,
                msg: "查找成功",
                data: result.map(item => {
                    return {
                        id: item.id,
                        name: item.name,
                        img: item.img,
                        desc: item.desc,
                        created_at: item.created_at.Format("yyyy-MM-dd hh:mm:ss"),
                        updated_at: item.updated_at.Format("yyyy-MM-dd hh:mm:ss")
                    }
                })
            })
        } else {
            res.json({
                status: 404,
                msg: "没有该案例信息"
            })
        }
    }).catch(err => {
        console.log(err);
    })
})

// 查询某个案例：http://localhost:8089/case/one
router.post("/one", (req, res) => {
    let id = req.body.id;
    caseModel.findAll({
        where: {
            id: id
        }
    }).then(result => {
        res.json({
            status: 200,
            msg: "查询成功",
            data: result.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    img: item.img,
                    desc: item.desc,
                    content: item.content.toString(),
                    created_at: item.created_at.Format("yyyy-MM-dd hh:mm:ss"),
                    updated_at: item.updated_at.Format("yyyy-MM-dd hh:mm:ss")
                }
            })
        })
    }).catch(err => {
        console.log(err);
    })
})

module.exports = router;