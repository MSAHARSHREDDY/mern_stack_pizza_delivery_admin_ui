import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { createUser, getUsers } from "../../http/Api";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateUserData, User } from "../../types";
import { useAuthStore } from "../../Store";
import UsersFilter from "./UsersFilter";
import {PlusOutlined} from "@ant-design/icons"
import { useState } from "react";
import UserForm from "./forms/UserForm";
import React from "react";

//This column is taken from table component go to ant design and verify
const columnsData=[
   {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'firstName',
        key: 'firstName',
        render: (_text: string, record: User) => {
            return (
                <div>
                    {record.firstName} {record.lastName}
                </div>
            );
        },
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
    },
    {
        title: 'Restaurant',
        dataIndex: 'tenant',
        key: 'tenant',
        render: (_text: string, record: User) => {
            return <div>{record.tenant?.name}</div>;
        },
    },
]

const UsersPage = () => {
  const [form]=Form.useForm()
  const queryClient=useQueryClient()
  const [currentEditingUser, setCurrentEditingUser] = React.useState<User | null>(null);
  const{
    token:{colorBgLayout},
  }=theme.useToken()
  const [drawerOpen,setDrawerOpen]=useState(false)
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return getUsers().then((res) => {
        console.log("Full API Response:", res.data);//In Axios, res.data gives you the whole response body
        console.log("Extracted Users Array:", res.data.data);
        return res.data.data;
      });
    },
  });

  const {user}=useAuthStore()

  const {mutate:userMutate}=useMutation({
    mutationKey:["user"],
    mutationFn:async(data:CreateUserData)=>createUser(data).then((res)=>res.data),
    onSuccess:async()=>{
       queryClient.invalidateQueries({ queryKey: ['users'] });
      return
    }
  })
  const onHandleSubmit=async()=>{
    await form.validateFields()
      console.log("Form values",form.getFieldsValue())
    await userMutate(form.getFieldsValue())
    form.resetFields()//once you submit it clear all the values
    setDrawerOpen(false)//It helps you to close the drawer
  
  }

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
          { title: "Users" },
        ]}
      />
      {isLoading && <div>Loading...</div>}
      {isError && <div>{(error as Error).message}</div>}
        
      {/**It is used for filtering out the data from table */}
      <UsersFilter onFilterChange={(filterName:string,filterValue:string)=>{
              console.log("filterName",filterName)
              console.log("filterValue",filterValue)
      }}>
        <Button type="primary" icon={<PlusOutlined/>} onClick={()=>setDrawerOpen(true)}>Add User</Button>
        {/**It is a component for search,role,status*/}
      </UsersFilter>

      {/**It is used for to display tables  */}
      <Table  columns={columnsData} dataSource={users} rowKey={"id"}/>

      {/**It is used for displaying drawer */}
      <Drawer title="Create User" styles={{body:{background:colorBgLayout}}} width={720} destroyOnClose={true} open={drawerOpen} 
      onClose={()=>{
        form.resetFields()//once you press on "x" it clear all the values
        setDrawerOpen(false)
        console.log("closing")
      }} 
      extra={
        <Space>
            <Button onClick={()=>{
            form.resetFields()//once you cancel it clear all the values
            setDrawerOpen(false)
            }}>Cancel</Button>
            <Button type="primary" onClick={onHandleSubmit}>Submit</Button>
        </Space>
      }>
        {/**Creating a user formcomponent */}
        <Form layout="vertical" form={form}>
          <UserForm isEditMode={!!currentEditingUser} />
        </Form>
        
      </Drawer>

    </Space>
      
      
    </>
  );
};

export default UsersPage;
