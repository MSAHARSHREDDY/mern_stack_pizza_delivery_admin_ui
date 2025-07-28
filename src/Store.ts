import { create } from "zustand"
import  {devtools} from "zustand/middleware"
import type { Tenant } from "./types"
export interface User{
    id:number,
    firstName:string,
    lastName:string,
    email:string,
    role:string,
    tenant?:Tenant
}

interface AuthState {
    user:null | User //if user is null then that user is loggedout
    setUser:(user:User)=>void
    logout:()=>void
}

//setuping the store
export const useAuthStore=create<AuthState>()(devtools((set)=>({
    user:null,
    setUser:(user)=>set({user}),
    logout:()=>set({user:null})
})))