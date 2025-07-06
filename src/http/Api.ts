import type { CreateUserData, Credentials, Tenant, User } from "../types";
import { api } from "./Client";

//Auth service>
export const login=(crendentials:Credentials)=>api.post("/auth/login",crendentials)
export const self=()=>api.get("/auth/self")
export const logout=()=>api.post("/auth/logout")
export const getUsers=()=>api.get("/users")
export const getTenants=()=>api.get("/tenants")
export const createUser=(user:CreateUserData)=>api.post("/users",user)

