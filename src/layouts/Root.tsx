
import { Outlet } from 'react-router-dom'
import {self} from "../http/Api"
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../Store';
import { useEffect } from 'react';
import { AxiosError } from 'axios';

const getSelf = async () => {
    const { data } = await self();
    return data;
};


const Root = () => {
    const {setUser}=useAuthStore()
    const {data,isLoading}=useQuery({
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