import axios from "axios"
import { useAuthStore } from "../Store"
// import { AUTH_SERVICE } from "./Api"


export const auth_api=axios.create({
    baseURL:import.meta.env.VITE_AUTH_BACKEND_API_URL,
    withCredentials:true,//This helps to store cookies in your browser
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json"
    }
})

export const catalog_api=axios.create({
    baseURL:import.meta.env.VITE_CATALOG_BACKEND_API_URL,
    withCredentials:true,//This helps to store cookies in your browser
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json"
    }
})

export const orders_api=axios.create({
    baseURL:import.meta.env.VITE_ORDERS_BACKEND_API_URL,
    withCredentials:true,//This helps to store cookies in your browser
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json"
    }
})

// //const refreshToken=()=>api.get("/auth/refresh")//api call to backend
// const refreshToken=async()=>{
//     await axios.post(`${import.meta.env.VITE_AUTH_BACKEND_API_URL}${AUTH_SERVICE}/auth/refresh`,{},{withCredentials:true})
//     //withCredentials:true sends cookies
// }


//const refreshToken=()=>api.get("/auth/refresh")//api call to backend
const refreshToken=async()=>{
    await axios.post(`${import.meta.env.VITE_AUTH_BACKEND_API_URL}/auth/refresh`,{},{withCredentials:true})
    //{}indictes body
    //withCredentials:true sends cookies
}

//Interceptors in Axios are functions that intercept every HTTP request or response before they are sent or received. They allow you to modify, log, or handle errors globally without repeating logic in every request.
auth_api.interceptors.response.use((response)=>response,async(error)=>{
    const originalRequest=error.config
    console.log("original request",originalRequest)
    if(error.response.status===401 && !originalRequest._isRetry ){
        try {
            originalRequest._isRetry=true
            const headers={...originalRequest.headers}
            await refreshToken()//If we get 401 error we are calling refresh token 
            return auth_api.request({...originalRequest,headers})
        } catch (error) {
            //If refresh token is going to expire user going to logged out
            console.log("Token refresh error",error)
            useAuthStore.getState().logout()
            return Promise.reject(error)
        }
    }
    else{
        return Promise.reject(error)
    }
} )


//Interceptors in Axios are functions that intercept every HTTP request or response before they are sent or received. They allow you to modify, log, or handle errors globally without repeating logic in every request.
catalog_api.interceptors.response.use((response)=>response,async(error)=>{
    const originalRequest=error.config
    console.log("original request",originalRequest)
    if(error.response.status===401 && !originalRequest._isRetry ){
        try {
            originalRequest._isRetry=true
            const headers={...originalRequest.headers}
            await refreshToken()//If we get 401 error we are calling refresh token 
            return catalog_api.request({...originalRequest,headers})
        } catch (error) {
            //If refresh token is going to expire user going to logged out
            console.log("Token refresh error",error)
            useAuthStore.getState().logout()
            return Promise.reject(error)
        }
    }
    else{
        return Promise.reject(error)
    }
} )