import axios from "axios"
import { useAuthStore } from "../Store"


export const api=axios.create({
    baseURL:import.meta.env.VITE_BACKEND_API_URL,
    withCredentials:true,//This helps to store cookies
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json"
    }
})

//const refreshToken=()=>api.get("/auth/refresh")//api call to backend
const refreshToken=async()=>{
    await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/auth/refresh`,{},{withCredentials:true})
    //withCredentials:true sends cookies
}
api.interceptors.response.use((response)=>response,async(error)=>{
    const originalRequest=error.config
    console.log("original request",originalRequest)
    if(error.response.status===401 && !originalRequest._isRetry ){
        try {
            originalRequest._isRetry=true
            const headers={...originalRequest.headers}
            await refreshToken()
            return api.request({...originalRequest,headers})
        } catch (error) {
            console.log("Token refresh error",error)
            useAuthStore.getState().logout()
            return Promise.reject(error)
        }
    }
    else{
        return Promise.reject(error)
    }
} )