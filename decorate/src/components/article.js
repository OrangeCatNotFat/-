import React from "react";
import {Avatar, Button, Col, Drawer, Form, Input, List, message, Modal, Row, Select, Space, Tag, Upload} from "antd";
import axios from "axios";
import {HOST, PORT} from "../config/apiconfig";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

class Article extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allCate: [], // 存放所有的类别
            allArticle: [], // 存放所有的文章
            selectedValue: "", // 记录当前选择器是文章标题还是文章类别
            addVisiable: false, // 记录添加抽屉是否打开
            fileList: [], // 图片文件列表
            previewVisiable: false, // 是否预览图片文件
            previewTitle: "", // 预览模态框上标题
            previewImage: "", // 预览的图片文件
        }
    }

    addRef = React.createRef(); // 操作添加表单

    getAllCate = () => { // 获取所有的类别
        axios.get(`${HOST}:${PORT}/cate/article`)
            .then(result => {
                if (result.data.status === 200) {
                    this.setState({
                        allCate: result.data.data
                    })
                    console.log(this.state.allCate);
                }
            }).catch(err => {
            console.log(err);
        })
    }

    getAllArticle = () => { // 获取所有的文章信息
        axios.get(`${HOST}:${PORT}/article/all`)
            .then(result => {
                if (result.data.status === 200) {
                    this.setState({
                        allArticle: result.data.data
                    })
                }
            }).catch(err => {
            console.log(err);
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
            onOk: this.addArticle
        })
    }

    addArticle = async () => { // 添加文章
        try {
            await this.addRef.current.validateFields()
                .then(value => {
                    axios.post(`${HOST}:${PORT}/article/add`, {
                        event: {
                            title: value.title,
                            cate: value.cate,
                            desc: value.desc,
                            cover: this.state.fileList[0].response.imgPath,
                            content: value.content.toHTML()
                        }
                    }).then(result => {
                        if (result.data.status === 201) {
                            message.success(result.data.msg);
                            this.setState({
                                addVisiable: false, // 关闭添加抽屉
                                fileList: [] // 将图片列表制空
                            })
                            this.getAllArticle();
                        }
                    })
                })
        } catch (err) {
            // throw err;
        }
    }

    componentDidMount() { // 页面加载完成后执行
        this.getAllCate(); // 获取所有的类别
        this.getAllArticle();
    }

    render() {
        const {allCate, selectedValue} = this.state;

        const editorProps = {
            contentFormat: "html",
            initialContent: "<p>hello</p>",
            // onChange: this.handleChange,
            // onRawChange: this.handleRowChange
        }

        const uploadButton = ( // 定义未上传时显示的按钮
            <div>
                <PlusOutlined/>
                <div style={{marginTop: "8px"}}>上传封面</div>
            </div>);

        const tagColors = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"];

        return (
            <div style={{padding: "30px 20px"}}>
                <div style={{width: "40%"}}>
                    <Input.Group compact style={{display: "flex"}} className={"select"}>
                        <Select defaultValue={"title"} onChange={value => { // 当变化时调用
                            // value是cate和title
                            this.setState({
                                selectedValue: value
                            })
                            this.getAllArticle(); // 切换时刷新文章
                        }}>
                            <Select.Option value={"title"}>文章标题</Select.Option>
                            <Select.Option value={"cate"}>文章类别</Select.Option>
                        </Select>
                        {selectedValue == "cate" ? (
                            <Select style={{width: "200px"}} defaultValue={allCate[0].id}>
                                {allCate.map(item => {
                                    return (
                                        <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                    )
                                })}
                            </Select>
                        ) : (<Input style={{width: "200px"}} id={"input"}/>)}&nbsp;&nbsp;&nbsp;
                        <Button type={"primary"}>搜索</Button>&nbsp;&nbsp;&nbsp;
                        <Button type={"primary"} onClick={() => this.setState({addVisiable: true})}>添加</Button>

                        <Drawer width={"80%"} visible={this.state.addVisiable}
                                onClose={() => this.setState({addVisiable: false, fileList: []})}
                                title={"编辑文章"}
                                extra={
                                    <Space>
                                        <Button type={"primary"} onClick={this.confirmAdd}>发布文章</Button>
                                        <Button type={"primary"}
                                                onClick={() => this.setState({
                                                    addVisiable: false,
                                                    fileList: []
                                                })}>取消编辑</Button>
                                    </Space>
                                }
                                destroyOnClose={true}>
                            <Form ref={this.addRef} layout={"vertical"} hideRequiredMark>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item name={"title"} rules={[{required: true, message: "请输入文章标题"}]}
                                                   initialValue={"【无标题】"}>
                                            <Input placeholder={"请输入文章标题"} size={"large"}
                                                   style={{borderRadius: "20px"}}/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item name={"content"}>
                                            <BraftEditor {...editorProps} style={{border: "1px solid #d9d9d9"}}
                                                         placeholder={"在这里输入正文"}/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={5}>
                                        <Form.Item name={"cate"} rules={[{required: true, message: "请选择类别"}]}
                                                   label={"文章类别"}>
                                            <Select style={{width: "200px"}}>
                                                {allCate.map(item => {
                                                    return (
                                                        <Select.Option value={item.id}
                                                                       key={item.id}>{item.name}</Select.Option>
                                                    )
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item name={"cover"} rules={[{required: true}]}>
                                            <Upload action={`${HOST}:${PORT}/cate/upload`}
                                                    name={"cover"}
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
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name={"desc"} rules={[{required: true, message: "请输入文章摘要"}]}>
                                            <TextArea placeholder={"请输入文章摘要"} autoSize={{minRows: 4, maxRows: 4}}
                                                      style={{width: "500px"}} showCount maxLength={255}></TextArea>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Drawer>
                    </Input.Group>
                </div>
                <List dataSource={this.state.allArticle} itemLayout={"vertical"} size={"large"}
                      style={{marginTop: "20px"}}
                      renderItem={item => (
                          <List.Item key={item.id}
                                     actions={[<Button type={"link"} icon={<EditOutlined/>}>编辑</Button>,
                                         <Button type={"link"} icon={<DeleteOutlined/>} danger>删除</Button>]}
                                     extra={<img width={272} height={153} alt={"logo"} src={item.cover}/>}>
                              <List.Item.Meta title={item.title}
                                              description={"创建时间：" + item.created_at + "\n更新时间：" + item.updated_at}
                                              avatar={<Avatar src={"https://joeschmoe.io/api/v1/random"}/>}/>
                              <Tag color={tagColors[allCate]}>{item.cate}</Tag>
                              {item.desc}
                          </List.Item>
                      )}
                >
                </List>
            </div>
        )
    }
}

export default Article;