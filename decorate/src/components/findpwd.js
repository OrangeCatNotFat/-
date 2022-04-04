import React, {useState} from "react";
import "../css/login.css";
import {Button, Col, Form, Input, message, Modal, Row, Steps} from "antd";
import {LeftOutlined, LockOutlined, UserOutlined} from "@ant-design/icons";
import {NavLink, Route} from "react-router-dom";
import axios from "axios";
import {HOST, PORT} from "../config/apiconfig";
import {BrowserRouter, Switch} from "react-router-dom";
import Login from "./login";

const {Step} = Steps;

export const Findpwd = function (props) {
    const form1Ref = React.createRef();
    const form2Ref = React.createRef();

    const [current, setCurrent] = useState(0); // 记录当前的步骤
    const [user, setUser] = useState({}); // 记录用户名

    const next = async () => { // 验证身份
        await form1Ref.current.validateFields()
            .then(value => { // value是验证成功控件的值：{username:"张三",name:"郑十"}
                axios.post(`${HOST}:${PORT}/admins/test`, {user: value})
                    .then(result => {
                        if (result.data.status === 200) {
                            setUser({username: value.username, name: value.name}); // 记录当前的用户名，用来改密码
                            message.success(result.data.msg); // 输出后端传来的信息
                            setCurrent(current + 1);
                        } else {
                            message.error(result.data.msg);
                        }
                    }).catch(err => {
                    console.log(err);
                })

            })
    }

    const modify = async () => { // 修改密码
        await form2Ref.current.validateFields()
            .then(value => { // value表示获取到的两个密码
                axios.post(`${HOST}:${PORT}/admins/updatePwd`, {
                    user: user,
                    password: value.password
                })
                    .then(result => {
                        if (result.data.status === 201) {
                            message.success(result.data.msg);
                            sessionStorage.setItem("username", user.username);
                            setTimeout(() => {
                                props.history.push("/"); // 路由跳转
                            }, 1000);
                        } else {
                            message.error(result.data.msg);
                        }
                    }).catch(err => {
                    console.log(err);
                })
            })
    }

    const steps = [ // 账号验证的步骤
        {
            title: "账号核实",
            content: function () { // 输入用户名和真实姓名
                return (
                    <Form ref={form1Ref}>
                        <Row>
                            <Col span={24}>
                                <Form.Item name={"username"}
                                           rules={[
                                               {
                                                   required: true,
                                                   message: "用户名不能为空"
                                               }
                                           ]}>
                                    <Input placeholder={"请输入用户名"}
                                           style={{borderRadius: "24px", width: "300px"}}
                                           prefix={<UserOutlined style={{color: 'rgba(0,0,0,0.25)'}}/>}
                                           size={"large"}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item name={"name"}
                                           rules={[
                                               {
                                                   required: true,
                                                   message: "真实姓名不能为空"
                                               }
                                           ]}>
                                    <Input placeholder={"请输入真实姓名"}
                                           size={"large"}
                                           style={{borderRadius: "24px", width: "300px"}}
                                           prefix={<UserOutlined style={{color: 'rgba(0,0,0,0.25)'}}/>}/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )
            }
        },
        {
            title: "修改密码",
            content: function () {
                return (
                    <Form ref={form2Ref}>
                        <Row>
                            <Col span={24}>
                                <Form.Item name="password"
                                           rules={[
                                               {
                                                   required: true,
                                                   message: "新密码不能为空"
                                               }
                                           ]}>
                                    <Input.Password
                                        style={{borderRadius: "24px", width: "300px"}}
                                        prefix={<LockOutlined style={{color: "rgba(0,0,0,0.25)"}}/>}
                                        placeholder={"请输入新密码"}
                                        size={"large"}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item name="confirmPwd"
                                           rules={[
                                               {
                                                   required: true,
                                                   message: "请重新输入密码"
                                               },
                                               {
                                                   validator: ((rule, value) => { // value表示当前控件的值
                                                       let pwd = form2Ref.current.getFieldValue("password"); // 获取输入的密码
                                                       if (pwd && pwd !== value) {
                                                           return Promise.reject("两次密码输入不一致")
                                                       } else {
                                                           return Promise.resolve(); // 表示验证通过
                                                       }
                                                   })
                                               }
                                           ]}>
                                    <Input.Password
                                        style={{borderRadius: "24px", width: "300px"}}
                                        prefix={<LockOutlined style={{color: "rgba(0,0,0,0.25)"}}/>}
                                        placeholder={"请确认密码"}
                                        size={"large"}/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )
            }
        }
    ]

    const back = () => {
        props.history.goBack();
    }

    return (
        <BrowserRouter>
            <div className={"loginPage"}>
                <section className={"find-content"}>
                    <div className={"back"}>
                        <Button type={"link"} style={{color: "#91A0B5", fontSize: "16px"}}
                                onClick={() => back()}><LeftOutlined/>返回</Button>
                    </div>
                    <h2 style={{padding: "10px 30px"}}>忘记密码</h2>
                    <Steps current={current} style={{width: "300px", marginBottom: "30px"}}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title}></Step>
                        ))}
                    </Steps>
                    <div className={"steps-content"}>{steps[current].content()}</div>
                    <div>
                        {current === 0 && (
                            <Button type={"primary"} style={{width: "300px", borderRadius: "24px"}} size={"large"}
                                    onClick={() => next()}>下一步</Button>
                        )}
                        {current === 1 && (
                            <Button type={"primary"} style={{width: "300px", borderRadius: "24px"}}
                                    size={"large"} onClick={() => modify()}>修改密码</Button>
                        )}
                    </div>
                </section>
            </div>
        </BrowserRouter>
    )
}