import type { Credentials } from "../types";
import { api } from "./client";

//Auth service>
export const login=(crendentials:Credentials)=>api.post("/auth/login",crendentials)