import React from "react";
import {Button, Table} from "antd";
import { Input } from 'antd';
import { Pagination } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import axios from "axios";

const { Column } = Table;

class OrderTable extends React.Component{
    constructor(props) {
        super(props);
        this.state= {
            data:[]
        }
    }
    componentDidMount() {
        // axios.get('http://localhost:8089/orders/all')
        //     .then(res=>{
        //         this.setState({
        //             data: res.data
        //         })
        //     })
    }


    render() {
        return(
            <>
                <div style={{width: "300px", float: "left"}}>
                    <Input placeholder="搜索预约姓名" width={'40%'} prefix={<UserOutlined />} />
                </div>
                <div style={{width: "100px", float: "left"}}>
                    <Button type="primary" >搜索</Button>
                </div>
                <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <br/>
                <Table dataSource={this.state.data} bordered>
                    <Column title={"预约id"} dataIndex={"id"} key={"id"} align={"center"}/>
                    <Column title={"预约姓名"} dataIndex={"name"} key={"name"} align={"center"}/>
                    <Column title={"电话"} dataIndex={"phone"} key={"phone"} align={"center"}/>
                    <Column title={"装修类型"} dataIndex={"type"} key={"type"} align={"center"}/>
                    <Column title={"预约日期"} dataIndex={"order_date"} key={"order_date"} align={"center"}/>
                    <Column title={"留言"} dataIndex={"message"} key={"message"} align={"center"}/>
                    <Column title={"状态"} dataIndex={"status"} key={"status"} align={"center"}/>
                    <Column title={"预约时间"} dataIndex={"created_at"} key={"created_at"} align={"center"}/>
                    <Column title={"操作"} dataIndex={"updated_at"} key={"updated_at"} align={"center"}/>
                </Table>

                <Pagination defaultCurrent={1} total={50} style={{float:"right"}}/>
            </>
        )
    }
}
export default OrderTable;