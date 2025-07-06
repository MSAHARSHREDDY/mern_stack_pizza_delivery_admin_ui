import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "../Store"


const NonAuth = () => {
  const location=useLocation()
     const {user}=useAuthStore()
    console.log("user",user)
    if(user!==null){//Means user logged in
      console.log("search",location.search)
      const returnTo=new URLSearchParams(location.search).get("returnTo") || "/"
        return <Navigate to={returnTo} replace={true}/>
    }
  return (
    <div>
         
        
         <Outlet/>{/*  The <Outlet> in the parent route component acts as the injection point for the elements of its child routes. */}
        
    </div>
  )
}

export default NonAuth