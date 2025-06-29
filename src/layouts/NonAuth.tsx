import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../Store"


const NonAuth = () => {
     const {user}=useAuthStore()
    console.log("user",user)
    if(user!==null){//Means user logged in
        return <Navigate to="/" replace={true}/>
    }
  return (
    <div>
         
        <h1>Non auth component</h1>
         <Outlet/>{/*  The <Outlet> in the parent route component acts as the injection point for the elements of its child routes. */}
        
    </div>
  )
}

export default NonAuth