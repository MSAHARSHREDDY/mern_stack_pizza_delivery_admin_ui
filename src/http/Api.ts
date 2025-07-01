import type { Credentials } from "../types";
import { api } from "./Client";

//Auth service>
export const login=(crendentials:Credentials)=>api.post("/auth/login",crendentials)
export const self=()=>api.get("/auth/self")
export const logout=()=>api.post("/auth/logout")

