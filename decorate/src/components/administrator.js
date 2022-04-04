import React, {useEffect, useState} from "react";
import {BrowserRouter} from "react-router-dom";
import {BackTop, Button, Form, Input, message, Modal, Pagination, Select, Space, Table, Tag} from "antd";
import axios from "axios";
import {HOST, PORT} from "../config/apiconfig";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined, InfoCircleOutlined} from "@ant-design/icons";

export const Administrator = () => {
    const [admins, setAdmins] = useState([]); // 存放所有的管理员数据，形式数组中存放对象
    const [state, setState] = useState(false); // 记录当前页面是否修改
    const [person, setPerson] = useState({}); // 记录要修改的用户的值
    const [modifyVisiable, setModifyVisiable] = useState(false); // 是否显示修改信息的模态框
    const [addVisiable, setAddVisiable] = useState(false); // 是否显示添加的模态框
    const [selectedValue, setSelectedValue] = useState(""); // 记录Select选择器选择身份搜索还是用户名搜索
    const [selectedRole, setSelectedRole] = useState(0); // 记录使用身份搜索时第二个选择器的值

    const modifyRef = React.createRef(); // 与修改模态框绑定
    const addRef = React.createRef(); // 与添加模态框绑定

    const {confirm} = Modal;

    // 打开模态框
    const showModifyModal = (record) => {
        setPerson(record);
        setModifyVisiable(true);
        // console.log(person);
    }
    const showAddModal = () => {
        setAddVisiable(true);
    }

    const addButton = [<Button type={"primary"} onClick={() => showAddModal()}>添加</Button>] // 控制添加按钮显示

    // 关闭模态框
    const handleModifyCancel = () => {
        setModifyVisiable(false);
    }
    const handleAddCancel = () => {
        setAddVisiable(false);
    }

    // 定义管理员身份标签
    const tagArr = [
        <Tag color={"red"}>超级管理员</Tag>,
        <Tag color={"green"}>普通管理员</Tag>,
        <Tag color={"default"}>账号已停用</Tag>
    ]

    const columns = [ // 定义表格的列
        {
            title: "编号",
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: "用户名",
            dataIndex: "username",
            key: "username",
            editable: true
        },
        {
            title: "姓名",
            dataIndex: "name",
            key: "name",
            editable: true
        },
        {
            title: "身份",
            dataIndex: "role",
            key: "role",
            render: role => (
                <div key={"role"}>
                    {tagArr[role]}
                </div>
            ),
            editable: true
        },
        {
            title: "上次登录",
            dataIndex: "last_login_at",
            key: "last_login_at"
        },
        {
            title: "创建时间",
            dataIndex: "created_at",
            key: "created_at"
        },
        {
            title: "更新时间",
            dataIndex: "updated_at",
            key: "updated_at"
        },
        sessionStorage.getItem("role") == 0 ?
            {
                title: "操作",
                key: "action",
                render: (text, record, index) => {// text：当前行的值，record：当前行的数据，index：当前行索引
                    // text和record是一样的结果，显示表格的具体信息,index是所有的索引，该索引是表格的索引0,1,2
                    return (
                        <Space size={"middle"}>
                            <Button type={"link"} icon={<EditOutlined/>}
                                    onClick={() => showModifyModal(record)}>编辑</Button>
                            <Button type={"link"} icon={<DeleteOutlined/>} danger
                                    onClick={() => showDeletConfirm(record.id)}>删除</Button>
                        </Space>
                    )
                }
            } : {},
    ];

    // 查询所有的管理员
    const allAdministrator = () => {
        axios.get(`${HOST}:${PORT}/admins/all`)
            .then(result => {
                if (result.data.status === 200) {
                    setAdmins(result.data.data);
                }
                if (result.data.status === 400) {
                    message.error(result.data.msg);
                }
            }).catch(err => {
            console.log(err);
        })
    }

    // 添加管理员
    const addAdministrator = async () => {
        await addRef.current.validateFields()
            .then(value => {
                axios.post(`${HOST}:${PORT}/admins/register`, {user: value})
                    .then(result => {
                        if (result.data.status === 201) {
                            message.success(result.data.msg);
                            setAddVisiable(false);
                            setState(!state);
                        } else {
                            message.success("注册失败");
                        }
                    }).catch(err => {
                    console.log(err);
                })
            })
    }

    const modify = async () => { // 修改管理员信息
        await modifyRef.current.validateFields()
            .then(value => { // 修改后的数据
                axios.post(`${HOST}:${PORT}/admins/modifyInfo`, {user: value, id: person.id})
                    .then(result => {
                        if (result.data.status === 201) {
                            message.success(result.data.msg);
                            setModifyVisiable(false);
                            setState(!state);
                        }
                    }).catch(err => {
                    console.log(err);
                })
            })
    }

    const deletePerson = (id) => { // 删除某个人
        // console.log(typeof id) // id是获取到的索引number类型
        axios.delete(`${HOST}:${PORT}/admins/delete`, {data: {id: id}})
            .then(result => {
                // console.log(result);
                if (result.data.status === 204) {
                    setState(!state); // 刷新
                    message.success(result.data.msg);
                } else {
                    message.error("删除失败");
                }
            }).catch(err => {
            console.log(err);
        })
    }

    const showModifyConfirm = () => { // 修改时弹出的确定框
        confirm({
            title: "确定修改",
            icon: <ExclamationCircleOutlined/>,
            onOk() {
                modify();
            },
            okText: "确定",
            cancelText: "取消",
            centered: true
        })
    }

    const showDeletConfirm = (id) => { // 删除时弹出的提示框
        confirm({
            title: "确定删除",
            icon: <ExclamationCircleOutlined/>,
            onOk() {
                deletePerson(id);
            },
            okText: "删除",
            cancelText: "取消",
            centered: true,
            okType: "danger"
        })
    }

    const showAddConfirm = async () => { // 添加用户信息询问框
        confirm({
            title: "添加用户",
            icon: <InfoCircleOutlined/>,
            onOk() {
                addAdministrator();
            },
            okText: "添加",
            cancelText: "取消",
            centered: true
        })
    }

    const searchInformation = () => { // 搜索用户信息
        if (selectedValue == "role") { // 使用身份搜索
            // console.log(selectedRole);
            axios.post(`${HOST}:${PORT}/admins/role`, {role: selectedRole})
                .then(result => {
                    if (result.data.status === 200) {
                        setAdmins(result.data.data);
                    }
                }).catch(err => {
                console.log(err);
            })
        } else { // 使用用户名搜索
            let value = document.getElementById("input").value; // 获取输入框的值
            if (value == "") {
                setState(!state);
                return;
            }
            axios.post(`${HOST}:${PORT}/admins/some`, {username: value})
                .then(result => {
                    if (result.data.status === 200) {
                        setAdmins(result.data.data);
                    }
                }).catch(err => {
                console.log(err);
            })
        }
    }

    useEffect(() => allAdministrator(), [state]); // 设置刷新当前页面的条件

    return (
        <BrowserRouter>
            <div style={{padding: "30px 20px"}}>
                <div style={{width: "40%"}}>
                    <Input.Group compact style={{display: "flex"}} className={"select"}>
                        <Select defaultValue={"username"} onChange={value => { // 当变化时调用
                            setSelectedValue(value); // 传递的是username和role
                            setState(!state); // 切换搜索途径时刷新一下
                        }}>
                            <Select.Option value={"username"}>用户名</Select.Option>
                            <Select.Option value={"role"}>身&nbsp;&nbsp;&nbsp;份</Select.Option>
                        </Select>
                        {selectedValue == "role" ? (
                            <Select style={{width: "200px"}} defaultValue={0} onChange={value => { // value是0，1，2
                                console.log(value, selectedRole);
                                setSelectedRole(value);
                                console.log(selectedRole);
                            }}>
                                <Select.Option value={0}>超级管理员</Select.Option>
                                <Select.Option value={1}>普通管理员</Select.Option>
                                <Select.Option value={2}>账户已停用</Select.Option>
                            </Select>
                        ) : (<Input style={{width: "200px"}} id={"input"}/>)}&nbsp;&nbsp;&nbsp;
                        <Button type={"primary"} onClick={() => searchInformation()}>搜索</Button>&nbsp;&nbsp;&nbsp;
                        {addButton[sessionStorage.getItem("role")]}
                    </Input.Group>
                </div>
                <Table rowKey={record => record.id} columns={columns} dataSource={admins}
                       style={{marginTop: "20px"}} pagination={{
                    pageSize: 5, // 每页显示条数
                    hideOnSinglePage: true, // 一页时隐藏分页器，
                    showQuickJumper: true,
                }}></Table>
                <Modal title={"修改管理员信息"} visible={modifyVisiable} okText={"修改"} cancelText={"取消"}
                       onCancel={handleModifyCancel}
                       destroyOnClose onOk={() => showModifyConfirm()} centered={true}>
                    <Form ref={modifyRef}>
                        <Form.Item label="用&nbsp;&nbsp;户&nbsp;&nbsp;名" name={"username"} initialValue={person.username}
                                   rules={[
                                       {
                                           required: true,
                                           message: "用户名不能为空"
                                       }
                                   ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={"真实姓名"} name={"name"} initialValue={person.name} rules={[
                            {
                                required: true,
                                message: "真实姓名不能为空"
                            }
                        ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="身&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;份" name={"role"} rules={[
                            {
                                required: true
                            }
                        ]} initialValue={person.role}>
                            <Select>
                                <Select.Option value={0}>超级管理员</Select.Option>
                                <Select.Option value={1}>普通管理员</Select.Option>
                                <Select.Option value={2}>账户已停用</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title={"添加管理人员"} visible={addVisiable} okText={"添加"} cancelText={"取消"} onCancel={handleAddCancel}
                       destroyOnClose centered={true} onOk={() => showAddConfirm()}>
                    <Form ref={addRef}>
                        <Form.Item label="用&nbsp;&nbsp;户&nbsp;&nbsp;名" name={"username"}
                                   rules={[{required: true, message: "请输入用户名"}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={"真实姓名"} name={"name"}
                                   rules={[{required: true, message: "请输入真实姓名"}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={"初始密码"} name={"password"} rules={[{required: true, message: "请输入初始密码"}]}>
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item label={"确认密码"} name={"confirmPwd"} rules={[{
                            required: true,
                            message: "请确认初始密码"
                        }, {
                            validator: ((rule, value) => { // value表示当前控件的值
                                let pwd = addRef.current.getFieldValue("password"); // 获取输入的密码
                                if (pwd && pwd !== value) {
                                    return Promise.reject("两次密码输入不一致")
                                } else {
                                    return Promise.resolve(); // 表示验证通过
                                }
                            })
                        }]}>
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item label="身&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;份" name={"role"}
                                   rules={[{required: true}]} initialValue={0}>
                            <Select>
                                <Select.Option value={0}>超级管理员</Select.Option>
                                <Select.Option value={1}>普通管理员</Select.Option>
                                <Select.Option value={2}>账户已停用</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </BrowserRouter>
    )
}