import { CreateTenantData, CreateUserData, Credentials, OrderStatus } from '../types';
import { api } from './Client';

export const AUTH_SERVICE = '/api/auth';
const CATALOG_SERVICE = '/api/catalog';
const ORDER_SERVICE = '/api/order';

// //Auth service>
// export const login=(crendentials:Credentials)=>auth_api.post(`/auth/login`,crendentials)
// export const self=()=>auth_api.get(`/auth/self`)
// export const logout=()=>auth_api.post(`/auth/logout`)
// export const getUsers=(queryString:string)=>auth_api.get(`/users?${queryString}`)//Here we are query string because we are using pagination in backend
// export const deleteUser = (id: string) => auth_api.delete(`/users/${id}`);
// export const getTenants=(queryString:string)=>auth_api.get(`/tenants?${queryString}`)//Here we are query string because we are using pagination in backend
// export const createUser=(user:CreateUserData)=>auth_api.post(`/users`,user)
// export const createTenant=(tenant:CreateTenantData)=>auth_api.post(`/tenants`,tenant)
// export const updateUser=(user:CreateUserData,id:string)=>auth_api.patch(`/users/${id}`,user)
// export const updateTenant=(tenant:CreateTenantData,id:number)=>auth_api.patch(`/tenants/${id}`,tenant)
// export const deleteTenant = (id: string) =>auth_api.delete(`/tenants/${id}`);

// //catalog service
// export const getCategories = () => catalog_api.get(`/categories`);
// export const getProducts = (queryParam: string) =>
//     catalog_api.get(`/products?${queryParam}`);
// export const createProduct = (product: FormData) =>
//     catalog_api.post(`/products`, product, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//     });
// export const getCategory = (id: string) => catalog_api.get(`/categories/${id}`);
// export const updateProduct = (product: FormData, id: string) => {
//     return catalog_api.put(`/products/${id}`, product, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//     });
// };

// export const deleteProduct = (id: string) => {
//     return catalog_api.delete(`/products/${id}`);
// };


// //order service
// export const getOrders = (queryString: string) => orders_api.get(`/orders?${queryString}`);
// export const getSingle = (orderId: string, queryString: string) =>orders_api.get(`/orders/${orderId}?${queryString}`);
// export const changeStatus = (orderId: string, data: { status: OrderStatus }) =>
//     orders_api.patch(`/orders/change-status/${orderId}`, data);



// Auth service
export const login = (credentials: Credentials) =>
    api.post(`${AUTH_SERVICE}/auth/login`, credentials);
export const self = () => api.get(`${AUTH_SERVICE}/auth/self`);
export const logout = () => api.post(`${AUTH_SERVICE}/auth/logout`);
export const getUsers = (queryString: string) => api.get(`${AUTH_SERVICE}/users?${queryString}`);
export const getTenants = (queryString: string) =>
    api.get(`${AUTH_SERVICE}/tenants?${queryString}`);
export const createUser = (user: CreateUserData) => api.post(`${AUTH_SERVICE}/users`, user);
export const createTenant = (tenant: CreateTenantData) =>
    api.post(`${AUTH_SERVICE}/tenants`, tenant);
export const updateUser = (user: CreateUserData, id: string) =>
    api.patch(`${AUTH_SERVICE}/users/${id}`, user);
export const deleteUser = (id: string) => api.delete(`/users/${id}`);
export const deleteTenant = (id: string) =>api.delete(`/tenants/${id}`);
export const updateTenant=(tenant:CreateTenantData,id:number)=>api.patch(`/tenants/${id}`,tenant)


// Catelog service
export const getCategories = () => api.get(`${CATALOG_SERVICE}/categories`);
export const getProducts = (queryParam: string) =>
    api.get(`${CATALOG_SERVICE}/products?${queryParam}`);
export const createProduct = (product: FormData) =>
    api.post(`${CATALOG_SERVICE}/products`, product, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
export const getCategory = (id: string) => api.get(`${CATALOG_SERVICE}/categories/${id}`);
export const updateProduct = (product: FormData, id: string) => {
    return api.put(`${CATALOG_SERVICE}/products/${id}`, product, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
export const deleteProduct = (id: string) => {
    return api.delete(`${CATALOG_SERVICE}/products/${id}`);
};


// Order service
export const getOrders = (queryString: string) => api.get(`${ORDER_SERVICE}/orders?${queryString}`);
export const getSingle = (orderId: string, queryString: string) =>
    api.get(`${ORDER_SERVICE}/orders/${orderId}?${queryString}`);
export const changeStatus = (orderId: string, data: { status: OrderStatus }) =>
    api.patch(`${ORDER_SERVICE}/orders/change-status/${orderId}`, data);