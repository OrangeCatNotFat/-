import {Route, Redirect} from "react-router-dom";
import {Component} from "react";

// 定义鉴权函数
let authenticate = () => {
    // 获取页面中存储的token
    let token = sessionStorage.getItem("token");
    // 根据是否存在token，返回不同的值
    return token ? true : false;
}

// 定义路由组件
const PrivateRoute = ({component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render={props => authenticate() ? <Component {...props}/> :
                <Redirect to={{
                    pathname: "/", // 指定重定向的路径
                    state: {from: props.location}
                }}/>
            }
        ></Route>
    )
}

export default PrivateRoute;