import { Link, Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../Store"



const Dashboard = () => {
    const {user}=useAuthStore()
    console.log("user",user)
    if(user===null){//If user is not logged in
        return <Navigate to={"/auth/login"} replace={true}/>
    }
  return (
    <div>
         
        <h1>Dashboard Component</h1>
        <Outlet/>{/*  The <Outlet> in the parent route component acts as the injection point for the elements of its child routes. */}
       
        
        
    </div>
  )
}

export default Dashboard