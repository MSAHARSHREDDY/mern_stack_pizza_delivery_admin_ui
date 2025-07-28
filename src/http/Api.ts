import type { CreateTenantData, CreateUserData, Credentials,  } from "../types";
import { api } from "./Client";

export const AUTH_SERVICE="/api/auth"
export const CATALOG_SERVICE="/api/catalog"

//Auth service>
export const login=(crendentials:Credentials)=>api.post(`${AUTH_SERVICE}/auth/login`,crendentials)
export const self=()=>api.get(`${AUTH_SERVICE}/auth/self`)
export const logout=()=>api.post(`${AUTH_SERVICE}/auth/logout`)
export const getUsers=(queryString:string)=>api.get(`${AUTH_SERVICE}/users?${queryString}`)//Here we are query string because we are using pagination in backend
export const getTenants=(queryString:string)=>api.get(`${AUTH_SERVICE}/tenants?${queryString}`)//Here we are query string because we are using pagination in backend
export const createUser=(user:CreateUserData)=>api.post(`${AUTH_SERVICE}/users`,user)
export const createTenant=(tenant:CreateTenantData)=>api.post(`${AUTH_SERVICE}/tenants`,tenant)
export const updateUser=(user:CreateUserData,id:string)=>api.patch(`${AUTH_SERVICE}/users/${id}`,user)
export const updateTenant=(tenant:CreateTenantData,id:number)=>api.patch(`${AUTH_SERVICE}/tenants/${id}`,tenant)

//catalog service
export const getCategories=()=>api.get(`${CATALOG_SERVICE}/categories`)
export const getProducts = (queryParam: string) =>
    api.get(`${CATALOG_SERVICE}/products?${queryParam}`);