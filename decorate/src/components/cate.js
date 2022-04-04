import React from "react";
import {BrowserRouter} from "react-router-dom";
import {Button, Form, Image, Input, message, Modal, Table, Upload} from "antd";
import axios from "axios";
import {HOST, PORT} from "../config/apiconfig";
import Draggable from "react-draggable";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";

class Cate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allcate: [], // 存放所有的类别
            addVisiable: false, // 是否显示添加模态框
            bounds: {left: 0, top: 0, bottom: 0, right: 0}, // 拖拽模态框初始参数
            disabled: true, // 是否可以拖拽
            fileList: [], // 图片文件列表
            previewVisiable: false, // 是否预览图片文件
            previewTitle: "", // 预览模态框上标题
            previewImage: "", // 预览的图片文件
            editVisiable: false, // 是否显示编辑模态框
            editInfo: "", // 记录要编辑的类的信息
            deleteId: "", // 记录要删除的Id
        }
    }

    draggleRef = React.createRef(); // 操作模态框的移动
    addRef = React.createRef(); // 操作添加表单
    editRef = React.createRef(); // 操作编辑表单

    getAllCate = () => { // 获取所有的案例
        axios.get(`${HOST}:${PORT}/cate/all`)
            .then(result => {
                if (result.data.status === 200) {
                    this.setState({
                        allcate: result.data.data
                    })
                }
            }).catch(err => {
            console.log(err);
        })
    }

    addCateModal = () => { // 打开添加类别的模态框
        this.setState({
            addVisiable: true
        })
    }

    handleCancel = () => { // 取消显示模态框
        this.setState({
            addVisiable: false,
            editVisiable: false,
            fileList: [] // 将图片文件删掉
        })
    }

    onStart = (event, uiData) => { // 拖拽模态框
        const {clientWidth, clientHeight} = window.document.documentElement; // 获取屏幕宽高
        const targetRect = this.draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        this.setState({
            bounds: {
                left: -targetRect.left + uiData.x,
                right: clientWidth - (targetRect.right - uiData.x),
                top: -targetRect.top + uiData.y,
                bottom: clientHeight - (targetRect.bottom - uiData.y),
            }
        })
    }

    getBase64 = (file) => { // 读取图片文件
        return new Promise((resolve, reject) => {
            const reader = new FileReader(); // 创建读取文件的对象
            reader.readAsDataURL(file); // 读取文件的url
            reader.onload = () => resolve(reader.result); // 返回文件内容
            reader.onerror = (err) => reject(err);
        })
    }

    beforeUpload = (file) => { // 对图片格式进行校验
        const isCorrect = (file.type === "image/jpeg" || file.type === "image/png"); // 判断图片格式是否正确
        if (!isCorrect) { // 如果不正确
            message.info("请上传JPG或PNG格式的图片");
            return Upload.LIST_IGNORE; // 阻止上传
        }
        return isCorrect;
    }

    handlePreview = async (file) => { // 图片预览功能
        if (!file.url && !file.preview) { // 如果文件没有打开且没有预览，打开并预览
            file.preview = await this.getBase64(file.originFileObj);
        }
        this.setState({
            previewVisiable: true, // 打开预览模态框
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf("/") + 1), // 设置标题
            previewImage: file.url || file.preview, // 设置预览图片
        })
    }

    handleImageChange = ({fileList}) => { // 设置上传的图片列表
        this.setState({
            fileList: fileList
        })
    }

    confirmAdd = () => { // 确定是否添加类别模态框
        Modal.confirm({
            title: "确定添加类别",
            okText: "确定",
            cancelText: "取消",
            centered: true,
            onOk: this.addCate
        })
    }

    confirmEdit = () => { // 确定编辑模态框
        Modal.confirm({
            title: "确定修改类别信息",
            okText: "确定",
            cancelText: "取消",
            centered: true,
            onOk: this.editCate
        })
    }

    confirmDelete = () => { // 确定删除模态框
        Modal.confirm({
            title: "你确定删除该类别吗",
            okText: "删除",
            cancelText: "取消",
            centered: true,
            onOk: this.delCate
        })
    }

    addCate = async () => { // 添加类别
        try {
            await this.addRef.current.validateFields()
                .then(value => {
                    axios.post(`${HOST}:${PORT}/cate/add`, {
                        event: {
                            name: value.name,
                            img: this.state.fileList[0].response.imgPath
                        }
                    }).then(result => {
                        // console.log(this.state.fileList) {uid: 'rc-upload-1648481789669-2', lastModified: 1648475446000, lastModifiedDate: Mon Mar 28 2022 21:50:46 GMT+0800 (中国标准时间), name: '1.jpeg', size: 6664, …}
                        if (result.data.status === 201) {
                            message.success(result.data.msg);
                            this.setState({
                                addVisiable: false, // 关闭添加模态框
                                fileList: [] // 将图片列表制空
                            })
                            this.getAllCate();
                        }
                    })
                })
        } catch (err) {
            // throw err;
        }
    }

    editCate = async () => { // 编辑当前案例
        try {
            await this.editRef.current.validateFields()
                .then(value => {
                    const event = {
                        id: this.state.editInfo.id,
                        name: value.name,
                        img: this.state.fileList[0].response.imgPath ? this.state.fileList[0].response.imgPath : this.state.fileList[0].url,
                    }
                    axios.put(`${HOST}:${PORT}/cate/modify`, {event: event})
                        .then(result => {
                            if (result.data.status === 201) {
                                message.success(result.data.msg);
                                this.setState({
                                    editVisiable: false,
                                    fileList: []
                                })
                                this.getAllCate();
                            }
                        })
                })

        } catch (err) {

        }
    }

    delCate = () => { // 删除类别
        axios.delete(`${HOST}:${PORT}/cate/delete`, {data: {id: this.state.deleteId}})
            .then(result => {
                if (result.data.status === 204) {
                    message.success(result.data.msg);
                    this.setState({
                        deleteId: ""
                    })
                    this.getAllCate(); // 刷新页面
                }
            })
    }

    selectCate = () => { // 搜索类别
        let value = document.getElementById("searchCate").value;
        if (value == "") {
            this.getAllCate();
            return;
        }
        axios.post(`${HOST}:${PORT}/cate/some`, {name: value})
            .then(result => {
                if (result.data.status === 200) {
                    this.setState({
                        allcate: result.data.data
                    })
                }
            }).catch(err => {
            console.log(err);
        })
    }

    componentDidMount() {
        this.getAllCate(); // 页面加载完成后获取全部案例数据
    }

    render() {
        const uploadButton = ( // 定义未上传时显示的按钮
            <div>
                <PlusOutlined/>
                <div style={{marginTop: "8px"}}>上传封面</div>
            </div>);

        return (
            <BrowserRouter>
                <div style={{padding: "30px 20px"}}>
                    <Input.Group compact>
                        <Input id={"searchCate"} style={{width: "200px"}} placeholder={"请输入类别名称"}/>&nbsp;&nbsp;&nbsp;
                        <Button type={"primary"} onClick={this.selectCate}>搜索</Button>&nbsp;&nbsp;&nbsp;
                        <Button type={"primary"} onClick={this.addCateModal}>添加</Button>
                    </Input.Group>
                    <Table style={{marginTop: "20px", textAlign: "center"}} dataSource={this.state.allcate}
                           rowKey={record => record.id} pagination={{
                        pageSize: 4,
                        pageSizeOptions: [5, 10, 20, 50, 100],
                        showTotal: total => "共" + "\n" + total + "\n" + "条记录",
                        hideOnSinglePage: true
                    }}>
                        <Table.Column align={"center"} title={"类别编号"} key={"id"} dataIndex={"id"}></Table.Column>
                        <Table.Column align={"center"} title={"类别名称"} key={"name"} dataIndex={"name"}></Table.Column>
                        <Table.Column align={"center"} title={"类别标识"} key={"img"} dataIndex={"img"}
                                      render={(value, record) => {
                                          // value是当前项的数据，record是整行的数据
                                          return (
                                              <div>
                                                  <Image src={value} alt={record.name} height={50}/>
                                              </div>
                                          )
                                      }}></Table.Column>
                        <Table.Column align={"center"} title={"创建时间"} key={"created_at"}
                                      dataIndex={"created_at"}></Table.Column>
                        <Table.Column align={"center"} title={"更新时间"} key={"updated_at"}
                                      dataIndex={"updated_at"}></Table.Column>
                        <Table.Column align={"center"} title={"操作"} key={"actions"}
                                      dataIndex={"actions"} render={(value, record) => {
                            return (
                                <div>
                                    <Button type={"link"} icon={<EditOutlined/>}
                                            onClick={async () => {
                                                await this.setState({
                                                    editInfo: record,
                                                    fileList: [{uid: record.id, url: record.img}],
                                                    editVisiable: true // 显示模态框
                                                })
                                            }}>编辑</Button>
                                    <Button type={"link"} icon={<DeleteOutlined/>} danger onClick={async () => {
                                        await this.setState({
                                            deleteId: record.id
                                        })
                                        this.confirmDelete();
                                    }}>删除< /Button>
                                </div>
                            )
                        }}></Table.Column>
                    </Table>
                    {/*添加模态框*/}
                    <Modal title={<div style={{width: "100%", cursor: "move"}} // 当鼠标移动到标题上时，鼠标变成十字
                                       onMouseOver={() => { // 当鼠标移动进标题时，设置为可以拖拽
                                           if (this.state.disabled) {
                                               this.setState({
                                                   disabled: false // 将不可拖拽关掉
                                               })
                                           }
                                       }}
                                       onMouseOut={() => { // 当鼠标移动出标题时，设置不可拖拽
                                           this.setState({
                                               disabled: true // 打开不可拖拽
                                           })
                                       }}>添加类别</div>}
                           visible={this.state.addVisiable}
                           centered={true}
                           okText={"提交"}
                           cancelText={"取消"}
                           onCancel={this.handleCancel}
                           onOk={this.confirmAdd}
                           destroyOnClose={true}
                           modalRender={modal => (
                               <Draggable disabled={this.state.disabled} bounds={this.state.bounds}
                                          onStart={(event, uiData) => this.onStart(event, uiData)}>
                                   <div ref={this.draggleRef}>{modal}</div>
                               </Draggable>
                           )}>
                        <Form ref={this.addRef}>
                            <Form.Item name={"name"} label={"类别名称"} rules={[{required: true, message: "请输入类别名称"}]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name={"img"} label={"类别标识"} rules={[{required: true}]}>
                                <Upload action={`${HOST}:${PORT}/cate/upload`}
                                        name={"img"}
                                        listType={"picture-card"}
                                        fileList={this.state.fileList}
                                        onChange={this.handleImageChange}
                                        data={file => ({photoContent: file})}
                                        onPreview={this.handlePreview}
                                        beforeUpload={this.beforeUpload}
                                        maxCount={1}>
                                    {this.state.fileList.length > 1 ? null : uploadButton}
                                </Upload>
                            </Form.Item>
                        </Form>
                    </Modal>
                    {/*编辑模态框*/}
                    <Modal title={<div style={{width: "100%", cursor: "move"}} // 当鼠标移动到标题上时，鼠标变成十字
                                       onMouseOver={() => { // 当鼠标移动进标题时，设置为可以拖拽
                                           if (this.state.disabled) {
                                               this.setState({
                                                   disabled: false // 将不可拖拽关掉
                                               })
                                           }
                                       }}
                                       onMouseOut={() => { // 当鼠标移动出标题时，设置不可拖拽
                                           this.setState({
                                               disabled: true // 打开不可拖拽
                                           })
                                       }}>编辑类别</div>}
                           visible={this.state.editVisiable}
                           centered={true}
                           okText={"提交"}
                           cancelText={"取消"}
                           onCancel={this.handleCancel}
                           onOk={this.confirmEdit}
                           destroyOnClose={true}
                           modalRender={modal => (
                               <Draggable disabled={this.state.disabled} bounds={this.state.bounds}
                                          onStart={(event, uiData) => this.onStart(event, uiData)}>
                                   <div ref={this.draggleRef}>{modal}</div>
                               </Draggable>
                           )}>
                        <Form ref={this.editRef}>
                            <Form.Item name={"name"} label={"类别名称"} rules={[{required: true, message: "请输入类别名称"}]}
                                       initialValue={this.state.editInfo.name}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name={"img"} label={"类别标识"} rules={[{required: true}]}>
                                <Upload action={`${HOST}:${PORT}/cate/upload`}
                                        name={"img"}
                                        listType={"picture-card"}
                                        fileList={this.state.fileList}
                                        onChange={this.handleImageChange}
                                        data={file => ({photoContent: file})}
                                        onPreview={this.handlePreview}
                                        beforeUpload={this.beforeUpload}
                                        maxCount={1}>
                                    {this.state.fileList.length > 1 ? null : uploadButton}
                                </Upload>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </BrowserRouter>
        )
    }
}

export default Cate;