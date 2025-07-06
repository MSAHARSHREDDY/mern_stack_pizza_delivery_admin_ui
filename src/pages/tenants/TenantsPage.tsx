import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getTenants } from "../../http/Api";
import { useAuthStore } from "../../Store";
import { Link, Navigate } from "react-router-dom";
import { Breadcrumb, Button, Drawer, Space, Table } from "antd";
import {PlusOutlined,RightOutlined} from "@ant-design/icons"
import TenantFilter from "./TenantsFilter";

const columnsData = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
];
const TenantsPage = () => {
  const [drawerOpen,setDrawerOpen]=useState(false)
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ["tenant"],
    queryFn: () => {
      return getTenants().then((res) => {
        console.log("Full API Response:", res.data);//In Axios, res.data gives you the whole response body
        console.log("Extracted Users Array:", res.data.data);
        return res.data.data;
      });
    },
  });

  const {user}=useAuthStore()
  if(user?.role!=="admin"){//we are providing protecting routes from url is user is not a admin, if user is not admin it tries to redirect to the home page
    return <Navigate to="/" replace={true}></Navigate>
  }
  return (
    <>
    <Space direction="vertical" size="large" style={{width:"100%"}}>
          <Breadcrumb
        separator={<RightOutlined />}
        items={[
          { title: <Link to="/">Dashboard</Link> },
          { title: "tenants" },
        ]}
      />
      {isLoading && <div>Loading...</div>}
      {isError && <div>{(error as Error).message}</div>}
        
      {/**It is used for filtering out the data from table */}
      <TenantFilter onFilterChange={(filterName:string,filterValue:string)=>{
              console.log("filterName",filterName)
              console.log("filterValue",filterValue)
      }}>
        <Button type="primary" icon={<PlusOutlined/>} onClick={()=>setDrawerOpen(true)}>Add Tenant</Button>
      </TenantFilter>

      {/**It is used for to display tables  */}
      <Table  columns={columnsData} dataSource={users} rowKey={"id"}/>

      {/**It is used for displaying drawer */}
      <Drawer title="Create Tenant" width={720} destroyOnClose={true} open={drawerOpen} onClose={()=>{
        setDrawerOpen(false)
        console.log("closing")
      }} extra={
        <Space>
            <Button>Cancel</Button>
            <Button type="primary">Submit</Button>
        </Space>
      }>
        <p>Some content</p>
          <p>Some content</p>
            <p>Some content</p>
              <p>Some content</p>
      </Drawer>

    </Space>
    </>
  )
}

export default TenantsPage