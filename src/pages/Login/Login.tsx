
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
    const {data}=await login(credentials)//here we are callng "login" from "api.ts" flile
    //axios is going to fetch the value "data"
    return data

     /**Below code also works */
    //  const { data } = await axios.post("http://localhost:5501/auth/login", credentials);
    // return data;
}

const getSelf=async()=>{
  const{data}=await self()
  console.log("data",data)
  return data

  /**Below code also works */
  // const { data } = await axios.get("http://localhost:5501/auth/self", {
  //   withCredentials: true
  //   });
  //   return data;
}

const LoginPage = () => {

  /**
   * useMutation is used for:
Performing side-effectful operations (POST, PUT, PATCH, DELETE) and managing their state (loading, success, error).
  Hook	        Purpose	HTTP Method
  useQuery	    Fetching (read) data	GET
  useMutation	  Changing (write) data	POST, PUT, PATCH, DELETE
   */

  const {isAllowed}=UsePermission()
  const {setUser,logout:logoutFromStore}=useAuthStore()//we are fetching from store

  const {refetch} = useQuery({//here useQuery is going to fetch the data or GET api
  queryKey: ["self"],
  queryFn: getSelf,//here we are calling getSelf function
  enabled: false //if we enabled:false it does not going to render the page
});

const {mutate:logoutMutate}=useMutation({//here useMutation is used when data is Changing (write) data	POST, PUT, PATCH, DELETE
  mutationKey: ["logout"],
  mutationFn: logout,
  onSuccess:async()=>{
    logoutFromStore()
    return
  }
  
})


const {mutate, isPending, isError, error} = useMutation({
  mutationKey: ["login"],//It is an unique key
  mutationFn: loginUser,//It is an function going to call loginUser
  onSuccess: async () => {
    //once login success we are going to fetch the users data
    const selfDataPromise = await refetch();  // Get fresh user data
    console.log("UserData", selfDataPromise.data);  // Correct place to access new user data
    //as it is an admin ui so customer tries to login so we call logout api
    //logout 
    if(!isAllowed(selfDataPromise.data)){
      logoutMutate()
      logoutFromStore()
      return
    }
    else{
         //storing user information in store
    setUser(selfDataPromise.data)
    }
 
    
    
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
          /*
          ->When you click on login button "onFinish" is going to trigger and used to fetch the values from each and every field of input
          ->here "intitialValues" are nothing but by default we are setting the value name "remember" to be checked, here "remember" which is taken from the line 106
          ->mutate:-It executes the function you define in mutationFn i.e "loginUser" and manages the request state for you (loading, success, error).

          */
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
