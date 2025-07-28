import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../Store";
import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
const { Header, Content, Footer, Sider } = Layout;
import Icon, { BellFilled } from "@ant-design/icons";
import { useState } from "react";
import Logo from "../components/icons/Logo";
import Home from "../components/icons/Home";
import { foodIcon } from "../components/icons/FoodIcon";
import BasketIcon from "../components/icons/BasketIcon";
import GiftIcon from "../components/icons/GiftIcon";
import UserIcon from "../components/icons/UserIcon";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/Api";

const getMenuItems = (role: string) => {
  

  const baseItems = [//If an manager is going to login it is going to display this one
    {
      key: "/",
      icon: <Icon component={Home} />,
      label: <NavLink to="/">Home</NavLink>,
    },
   

    {
      key: "/products",
      icon: <Icon component={BasketIcon} />,
      label: <NavLink to="/products">Products</NavLink>,
    },
    // {
    //   key: "/orders",
    //   icon: <Icon component={BasketIcon} />,
    //   label: <NavLink to="/orders">Orders</NavLink>,
    // },
    {
      key: "/promos",
      icon: <Icon component={GiftIcon} />,
      label: <NavLink to="/promos">Promos</NavLink>,
    },
  ];

  if (role === "admin") {//If role is an admin it is going to display including users
    const menus= [...baseItems]
    menus.splice(1,0,   {
        key: "/users",
        icon: <Icon component={UserIcon} />,
        label: <NavLink to="/users">Users</NavLink>,//it is going to redirect to router.tsx "/users" route and render userspage
      })
      menus.splice(2, 0, {
            key: '/restaurants',
            icon: <Icon component={foodIcon} />,
            label: <NavLink to="/restaurants">Restaurants</NavLink>,
        });
      return menus
    }
  return baseItems
};



const Dashboard = () => {
  const location=useLocation()
  const { logout: logoutFromStore } = useAuthStore();
  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: async () => {
      logoutFromStore();
      return;
    },
  });

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { user } = useAuthStore();
  console.log("user", user);
  if (user === null) {
    //If user is not logged in we are trying to redirect to login page
    //When u refrresh the page, the window need to be in same page
    return <Navigate to={`/auth/login?returnTo=${location.pathname}`} replace={true} />;
  }

  const items=getMenuItems(user.role)//calling getMenuItems

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          theme="light"
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="logo">
            <Logo />
          </div>
          <Menu
            theme="light"
            defaultSelectedKeys={[location.pathname]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              paddingLeft: "16px",
              paddingRight: "16px",
              background: colorBgContainer,
            }}
          >
            <Flex gap="middle" align="start" justify="space-between">
              <Badge
                text={
                  user.role === "admin" ? "You are an admin" : user.tenant?.name
                }
                status="success"
              ></Badge>

              <Space size={16}>
                <Badge dot={true}>
                  <BellFilled />
                </Badge>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "logout",
                        label: "Logout",
                        onClick: () => logoutMutate(),
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Avatar
                    style={{
                      backgroundColor: "#fde3cf",
                      color: "#f56a00",
                    }}
                  >
                    U
                  </Avatar>
                </Dropdown>
              </Space>
            </Flex>
          </Header>

          <Content style={{ margin: "24px" }}>
            <Outlet />
            {/*  The <Outlet> in the parent route component acts as the injection point for the elements of its child routes. */}
          </Content>
          <Footer style={{ textAlign: "center" }}>Mern Space Pizza Shop</Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default Dashboard;
