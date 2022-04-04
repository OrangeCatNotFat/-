import React from "react";
import {Layout, Menu, Dropdown, Button} from "antd";
import {BrowserRouter, HashRouter, NavLink, Route, Switch} from "react-router-dom";
import {
    AppstoreFilled,
    BarsOutlined,
    CaretDownOutlined, DownOutlined, FileTextOutlined,
    GiftOutlined,
    HomeOutlined, PictureOutlined, SettingOutlined, TagsOutlined, TeamOutlined
} from "@ant-design/icons";
import OrderTable from "./OrderTable";
import Case from "./case";
import Home from "./home";
import Cate from "./cate";
import {Administrator} from "./administrator";
import Article from "./article";

const {Header, Content, Sider} = Layout;

class Frame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1 // 记录点击到了哪个页面
        }
    }

    // 个人信息下拉框
    DownMenu = () => {
        return (
            <Menu>
                <Menu.Item key={"1"}>
                    <a>退出登录</a>
                </Menu.Item>
            </Menu>
        )
    }

    // 标签选项
    TagSelectMenu = () => {
        return (
            // 编写onClick事件
            <Menu>
                <Menu.Item key={"1"}>清空标签</Menu.Item>
                <Menu.Item key={"2"}>2</Menu.Item>
            </Menu>
        )
    }

    render() {
        const key = this.state.key;
        const pageTitle = [
            <div style={{color: "rgb(147,147,147)", fontSize: "18px", fontFamily: "微软雅黑"}}>
                <HomeOutlined/>&nbsp;&nbsp;系统首页</div>,
            <div style={{color: "rgb(147,147,147)", fontSize: "18px", fontFamily: "微软雅黑"}}>
                <BarsOutlined/>&nbsp;&nbsp;预约管理</div>,
            <div style={{color: "rgb(147,147,147)", fontSize: "18px", fontFamily: "微软雅黑"}}>
                <GiftOutlined/>&nbsp;&nbsp;活动管理</div>,
            <div style={{color: "rgb(147,147,147)", fontSize: "18px", fontFamily: "微软雅黑"}}>
                <TagsOutlined/>&nbsp;&nbsp;分类管理</div>,
            <div style={{color: "rgb(147,147,147)", fontSize: "18px", fontFamily: "微软雅黑"}}>
                <FileTextOutlined/>&nbsp;&nbsp;文章管理</div>,
            <div style={{color: "rgb(147,147,147)", fontSize: "18px", fontFamily: "微软雅黑"}}>
                <PictureOutlined/>&nbsp;&nbsp;案例管理</div>,
            <div style={{color: "rgb(147,147,147)", fontSize: "18px", fontFamily: "微软雅黑"}}>
                <SettingOutlined/>&nbsp;&nbsp;企业信息管理</div>,
            <div style={{color: "rgb(147,147,147)", fontSize: "18px", fontFamily: "微软雅黑"}}>
                <TeamOutlined/>&nbsp;&nbsp;管理员管理</div>
        ]
        return (
            // BrowserRouter表示使用了history模式的路由，必须放在最外层
            <HashRouter>
                {/*使用顶部——侧边栏——通栏的布局*/}
                <div className={"container"}>
                    <Header className={"header"}>
                        <AppstoreFilled style={{color: "white", fontSize: "30px", marginTop: "17px", float: "left"}}/>
                        <div style={{
                            color: "white",
                            fontFamily: "微软雅黑",
                            fontSize: "25px",
                            float: "left",
                            marginLeft: "30px"
                        }}>创客装修后台管理系统
                        </div>
                        <Dropdown overlay={this.DownMenu} trigger={["click"]}>
                            <a className={"ant-dropdown-link"} onClick={e => e.preventDefault()}
                               style={{color: "white", float: "right"}}>
                                {sessionStorage.getItem("username")}<CaretDownOutlined/>
                            </a>
                        </Dropdown>
                    </Header>
                    <Layout style={{
                        position: "fixed",
                        width: "100%",
                        height: "91%",
                        overflow: "auto"
                    }}>
                        <Sider width={200} className={"site-layout-background"}
                               style={{backgroundColor: "white", overflow: "auto"}}>
                            <Menu mode={"inline"} defaultSelectedKeys={["1"]} defaultOpenKeys={["1"]}
                                  style={{height: "100%", borderRight: 0}}
                                  onClick={async key => {
                                      await this.setState({
                                          key: key.key
                                      })
                                  }}>
                                <Menu.Item key={"1"} style={{marginTop: 0}}>
                                    <NavLink to={"/home"}>
                                        <HomeOutlined/>&nbsp;&nbsp;系统首页
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item key={"2"}>
                                    <NavLink to={"/orders"}>
                                        <BarsOutlined/>&nbsp;&nbsp;预约管理
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item key={"3"}>
                                    <NavLink to={"/active"}>
                                        <GiftOutlined/>&nbsp;&nbsp;活动管理
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item key={"4"}>
                                    <NavLink to={"/cate"}>
                                        <TagsOutlined/>&nbsp;&nbsp;分类管理
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item key={"5"}>
                                    <NavLink to={"/article"}>
                                        <FileTextOutlined/>&nbsp;&nbsp;文章管理
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item key={"6"}>
                                    <NavLink to={"/case"}>
                                        <PictureOutlined/>&nbsp;&nbsp;案例管理
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item key={"7"}>
                                    <NavLink to={"/info"}>
                                        <SettingOutlined/>&nbsp;&nbsp;企业信息管理
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item key={"8"}>
                                    <NavLink to={"/administrator"}>
                                        <TeamOutlined/>&nbsp;&nbsp;管理员管理
                                    </NavLink>
                                </Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout style={{float: "right", marginLeft: "1px"}}>
                            <div style={{
                                width: "100%",
                                height: "40px",
                                backgroundColor: "white",
                                float: "right"
                            }}>
                                <div style={{float: "left"}}>点击一个页面添加一个标签</div>
                                <div style={{
                                    width: "130px",
                                    height: "100%",
                                    float: "right",
                                    borderLeft: "2px solid rgb(240,240,240)",
                                    marginTop: "4px"
                                }}>
                                    <Dropdown overlay={this.TagSelectMenu}>
                                        <Button type={"primary"} style={{
                                            float: "right",
                                            marginRight: "10px"
                                        }}>标签选项<DownOutlined/></Button>
                                    </Dropdown>
                                </div>
                            </div>
                            <Layout style={{
                                padding: "20px 24px 50px",
                                minHeight: "400px"
                            }}>
                                <div>{pageTitle[key - 1]}</div>
                                {/*导航栏旁边的区域*/}
                                <Content className={"site-layout-background"}
                                         style={{
                                             marginTop: "10px",
                                             backgroundColor: "white",
                                             height: "500px",
                                             overflow: "auto"
                                         }}>
                                    <Switch>
                                        <Route path={"/home"} component={Home}></Route>
                                        <Route path={"/orders"} component={OrderTable}></Route>
                                        <Route path={"/active"}></Route>
                                        <Route path={"/case"} component={Case}></Route>
                                        <Route path={"/article"} component={Article}></Route>
                                        <Route path={"/info"}></Route>
                                        <Route path={"/cate"} component={Cate}></Route>
                                        <Route path={"/administrator"} component={Administrator}></Route>
                                    </Switch>
                                </Content>
                            </Layout>
                        </Layout>
                    </Layout>
                </div>
            </HashRouter>
        );
    }
}

export default Frame;

