
import {Alert, Button, Card, Checkbox, Flex, Form, Input, Layout, Space} from "antd"
import {LockFilled, LockOutlined, UserOutlined} from "@ant-design/icons"
import Logo from "../../components/icons/Logo"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { Credentials } from "../../types"
import { login, self,logout } from "../../http/Api"
import { useAuthStore } from "../../Store"
import { UsePermission } from "../../hooks/UserPermission"

const loginUser=async(credentials:Credentials)=>{
    //server call logic
    const {data}=await login(credentials)
    return data
}

const getSelf=async()=>{
  const{data}=await self()
  console.log("data",data)
  return data
}

const LoginPage = () => {
  const {isAllowed}=UsePermission()
  const {setUser,logout:logoutFromStore}=useAuthStore()//Store

  const {refetch} = useQuery({
  queryKey: ["self"],
  queryFn: getSelf,
  enabled: false
});

const {mutate:logoutMutate}=useMutation({
  mutationKey: ["logout"],
  mutationFn: logout,
  onSuccess:async()=>{
    logoutFromStore()
    return
  }
  
})
const {mutate, isPending, isError, error} = useMutation({
  mutationKey: ["login"],
  mutationFn: loginUser,
  onSuccess: async () => {
    const selfDataPromise = await refetch();  // Get fresh user data
    console.log("UserData", selfDataPromise.data);  // Correct place to access new user data
    //logout 
    if(!isAllowed(selfDataPromise.data)){
      logoutMutate()
      logoutFromStore()
      return
    }
    // if(selfDataPromise.data.role==="customer"){
    //   await logout()
    //   logoutFromStore()
    //   return
    // }

    setUser(selfDataPromise.data)
    
    
  }
});

  return(
    <>
    <Layout style={{height:"100vh",display:"grid",placeItems:"center"}}>
      <Space direction="vertical" align="center" size="large">

        <Layout.Content style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
             <Logo/>
        </Layout.Content>  

        <Card bordered={false} style={{width:300}} title={<Space style={{width:"100%",fontSize:16,justifyContent:"center"}}><LockFilled/>Sign in</Space>}>

          <Form initialValues={{remember:true}} onFinish={(values)=>{
            mutate({email:values.username,password:values.password})
            console.log(values)
          }}>
            {
              isError &&(<Alert style={{marginBottom:24}} type="error" message={error.message}/>)
            }
              <Form.Item name="username" rules={[
                {
                  required:true,
                  message:"Please enter your Username"
                },{
                  type:"email",
                  message:"Email is not valid"
                }
              ]}>
                  <Input prefix={<UserOutlined/>} placeholder="Username"/>
              </Form.Item>

              <Form.Item name="password" rules={[
                {
                  required:true,
                  message:"Please enter your password"
                }
              ]}>
                  <Input.Password prefix={<LockOutlined/>} placeholder="Password"/>
              </Form.Item>

              <Flex justify="space-between " >
                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <a href="" id="login-form-forgot">Forgot Password</a>
              </Flex>
              


              <Form.Item>
                <Button type="primary" htmlType="submit" style={{width:"100%"}} loading={isPending}>Log in</Button>
              </Form.Item>
          </Form>
      
        </Card>
     
      </Space>

    </Layout>
    </>
  )
  
  
}

export default LoginPage
