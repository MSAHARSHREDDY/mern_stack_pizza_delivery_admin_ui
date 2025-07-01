import {  Navigate, NavLink, Outlet } from "react-router-dom"
import { useAuthStore } from "../Store"
import {  Layout, Menu, theme } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import Icon,{HomeOutlined,UserOutlined} from "@ant-design/icons"
import { useState } from "react";
import Logo from "../components/icons/Logo";
import Home from "../components/icons/Home";
import { foodIcon } from "../components/icons/FoodIcon";
import BasketIcon from "../components/icons/BasketIcon";
import GiftIcon from "../components/icons/GiftIcon";
import UserIcon from "../components/icons/UserIcon";

 const baseItems = [
        {
            key: '/',
            icon: <Icon component={Home} />,
            label: <NavLink to="/">Home</NavLink>,
        },
        {
            key: '/users',
            icon: <Icon component={UserIcon} />,
            label: <NavLink to="/users">Users</NavLink>,
        },
        {
            key: '/restaurants',
            icon: <Icon component={foodIcon} />,
            label: <NavLink to="/restaurants">Restaurants</NavLink>,
        },

        {
            key: '/products',
            icon: <Icon component={foodIcon} />,
            label: <NavLink to="/products">Products</NavLink>,
        },
        {
            key: '/orders',
            icon: <Icon component={BasketIcon} />,
            label: <NavLink to="/orders">Orders</NavLink>,
        },
        {
            key: '/promos',
            icon: <Icon component={GiftIcon} />,
            label: <NavLink to="/promos">Promos</NavLink>,
        },
    ];



const Dashboard = () => {
  const [collapsed,setCollapsed]=useState(false)
  const {
    token:{colorBgContainer},
  }=theme.useToken()


    const {user}=useAuthStore()
    console.log("user",user)
    if(user===null){//If user is not logged in
        return <Navigate to={"/auth/login"} replace={true}/>
    }
  return (
    <div>
         
        <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible theme="light" collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo">
          <Logo/>
        </div>
        <Menu theme="light" defaultSelectedKeys={['/']} mode="inline" items={baseItems} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer}} />
        <Content style={{ margin: '0 16px' }}>
         
          <Outlet/>{/*  The <Outlet> in the parent route component acts as the injection point for the elements of its child routes. */}

        </Content>
        <Footer style={{ textAlign: 'center' }}>
            Mern Space Pizza Shop
        </Footer>
      </Layout>
    </Layout>
      
       
        
        
    </div>
  )
}

export default Dashboard