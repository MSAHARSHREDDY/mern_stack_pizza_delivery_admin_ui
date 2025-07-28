//This root.tsx file is going to solve the refresh problem,it solves when you try to refresh the page user is going to logged out, this file is going to solve that problem.Even if you refresh the page the user is not going to logged out
import { Outlet } from 'react-router-dom'
import {self} from "../http/Api"
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../Store';
import { useEffect } from 'react';
import { AxiosError } from 'axios';

const getSelf = async () => {
    const { data } = await self();
    return data;

    /**
         * Below code also works
         
        const {data}=await axios.get("http://localhost:5501/auth/self",{
            withCredentials:true
        })
        return data
        */
};


const Root = () => {
    const {setUser}=useAuthStore()
    const {data,isLoading}=useQuery({//UseQuery is used when you are going to fetch the data
        queryKey:["self"],
        queryFn:getSelf,
        retry:(failureCount:number,error)=>{
            if(error instanceof AxiosError && error.response?.status===401){
                return false
            }
            return failureCount<3
        }
    })

    useEffect(()=>{
        console.log("data",data)
        if(data){
            setUser(data)
        }
        
    },[data,setUser])

    if(isLoading){
        return <div>Loading....</div>
    }
  return <Outlet/>
  
}

export default Root