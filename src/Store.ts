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
    user:null | User
    setUser:(user:User)=>void
    logout:()=>void
}

export const useAuthStore=create<AuthState>()(devtools((set)=>({
    user:null,
    setUser:(user)=>set({user}),
    logout:()=>set({user:null})
})))