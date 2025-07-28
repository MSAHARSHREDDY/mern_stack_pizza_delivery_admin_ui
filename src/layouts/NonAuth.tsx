import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "../Store"


const NonAuth = () => {
  const location=useLocation()
     const {user}=useAuthStore()
    console.log("user",user)
    if(user!==null){//It means user values are stored in store
      //If user is logged in we are trying to redirect to home page
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