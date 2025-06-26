import axios from "axios"

export const api=axios.create({
    baseURL:import.meta.env.VITE_BACKEND_API_URL,
    withCredentials:true,//This helps to store cookies
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json"
    }
})