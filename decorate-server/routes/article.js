const express = require("express");
const router = express.Router();
const articleModel = require("../model/articleModel");
const Format = require("../js/Format");

// 查询所有文章：http://localhost:8089/article/all
router.get('/all', (req, res) => {
    articleModel.findAll({
        raw: true,
    }).then(result => {
        res.json({
            status: 200,
            msg: '查询成功',
            data: result.map(item => {
                return {
                    id: item.id,
                    title: item.title,
                    cate: item.cate,
                    desc: item.desc,
                    cover: item.cover,
                    created_at: item.created_at.Format("yyyy-MM-dd hh:mm:ss"),
                    updated_at: item.updated_at.Format("yyyy-MM-dd hh:mm:ss")
                }
            })
        })
    }).catch(err => {
        console.log(err)
    })
})

// 添加信息：http://localhost:8089/article/add
router.post("/add", (req, res) => {
    let event = req.body.event;
    articleModel.create({
        id: null,
        title: event.title,
        cate: event.cate,
        desc: event.desc,
        cover: event.cover,
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


// 删除信息：http://localhost:8089/article/del
router.delete("/del", (req, res) => {
    articleModel.destroy({
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

// 更新信息：http://localhost:8089/article/modify
router.put("/modify", (req, res) => {
    let event = req.body.event;
    articleModel.findOne({
        where: {
            id: event.id
        }
    }).then(info => {
        info.update({
            title: event.title,
            desc: event.desc,
            cover: event.cover,
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

module.exports = router;