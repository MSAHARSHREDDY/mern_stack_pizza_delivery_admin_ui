// import { useQuery } from "@tanstack/react-query";
// import { useState } from "react";
// import { getTenants } from "../../http/Api";
// import { useAuthStore } from "../../Store";
// import { Link, Navigate } from "react-router-dom";
// import { Breadcrumb, Button, Drawer, Space, Table } from "antd";
// import {PlusOutlined,RightOutlined} from "@ant-design/icons"
// import TenantFilter from "./TenantsFilter";

// const columnsData = [
//     {
//         title: 'ID',
//         dataIndex: 'id',
//         key: 'id',
//     },
//     {
//         title: 'Name',
//         dataIndex: 'name',
//         key: 'name',
//     },
//     {
//         title: 'Address',
//         dataIndex: 'address',
//         key: 'address',
//     },
// ];
// const TenantsPage = () => {
//   const [drawerOpen,setDrawerOpen]=useState(false)
//   const { data: users, isLoading, isError, error } = useQuery({
//     queryKey: ["tenant"],
//     queryFn: () => {
//       return getTenants().then((res) => {
//         console.log("Full API Response:", res.data);//In Axios, res.data gives you the whole response body
//         console.log("Extracted Users Array:", res.data.data);
//         return res.data.data;
//       });
//     },
//   });

//   const {user}=useAuthStore()
//   if(user?.role!=="admin"){//we are providing protecting routes from url is user is not a admin, if user is not admin it tries to redirect to the home page
//     return <Navigate to="/" replace={true}></Navigate>
//   }
//   return (
//     <>
//     <Space direction="vertical" size="large" style={{width:"100%"}}>
//           <Breadcrumb
//         separator={<RightOutlined />}
//         items={[
//           { title: <Link to="/">Dashboard</Link> },
//           { title: "tenants" },
//         ]}
//       />
//       {isLoading && <div>Loading...</div>}
//       {isError && <div>{(error as Error).message}</div>}
        
//       {/**It is used for filtering out the data from table */}
//       <TenantFilter onFilterChange={(filterName:string,filterValue:string)=>{
//               console.log("filterName",filterName)
//               console.log("filterValue",filterValue)
//       }}>
//         <Button type="primary" icon={<PlusOutlined/>} onClick={()=>setDrawerOpen(true)}>Add Tenant</Button>
//       </TenantFilter>

//       {/**It is used for to display tables  */}
//       <Table  columns={columnsData} dataSource={users} rowKey={"id"}/>

//       {/**It is used for displaying drawer */}
//       <Drawer title="Create Tenant" width={720} destroyOnClose={true} open={drawerOpen} onClose={()=>{
//         setDrawerOpen(false)
//         console.log("closing")
//       }} extra={
//         <Space>
//             <Button>Cancel</Button>
//             <Button type="primary">Submit</Button>
//         </Space>
//       }>
//         <p>Some content</p>
//           <p>Some content</p>
//             <p>Some content</p>
//               <p>Some content</p>
//       </Drawer>

//     </Space>
//     </>
//   )
// }

// export default TenantsPage



import {
    Breadcrumb,
    Button,
    Drawer,
    Flex,
    Form,
    Space,
    Spin,
    Table,
    Typography,
    theme,
} from 'antd';
import { RightOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../Store';
import React from 'react';
import TenantFilter from './TenantsFilter';
import { createTenant, getTenants } from '../../http/Api';
import TenantForm from './forms/TenantForm';
import type { CreateTenantData, FieldData } from '../../types';
import { PER_PAGE } from '../../Constants';

import { debounce } from 'lodash';

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
];

const Tenants = () => {
    const {
        token: { colorBgLayout },
    } = theme.useToken();

    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();

    const [queryParams, setQueryParams] = React.useState({
        perPage: PER_PAGE,
        currentPage: 1,
    });

    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const {
        data: tenants,
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: ['tenants', queryParams],
        queryFn: () => {
            const filteredParams = Object.fromEntries(
                Object.entries(queryParams).filter((item) => !!item[1])
            );

            const queryString = new URLSearchParams(
                filteredParams as unknown as Record<string, string>
            ).toString();

            return getTenants(queryString).then((res) => res.data);
        },
        placeholderData: keepPreviousData,
    });

    const { user } = useAuthStore();

    const queryClient = useQueryClient();
    const { mutate: tenantMutate } = useMutation({
        mutationKey: ['tenant'],
        mutationFn: async (data: CreateTenantData) => createTenant(data).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            return;
        },
    });

    const onHandleSubmit = async () => {
        await form.validateFields();
        await tenantMutate(form.getFieldsValue());
        form.resetFields();
        setDrawerOpen(false);
    };

    const debouncedQUpdate = React.useMemo(() => {
        return debounce((value: string | undefined) => {
            setQueryParams((prev) => ({ ...prev, q: value }));
        }, 500);
    }, []);

    const onFilterChange = (changedFields: FieldData[]) => {
        const changedFilterFields = changedFields
            .map((item) => ({
                [item.name[0]]: item.value,
            }))
            .reduce((acc, item) => ({ ...acc, ...item }), {});

        if ('q' in changedFilterFields) {
            debouncedQUpdate(changedFilterFields.q);
        } else {
            setQueryParams((prev) => ({ ...prev, ...changedFilterFields }));
        }
    };

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace={true} />;
    }

    return (
        <>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Flex justify="space-between">
                    <Breadcrumb
                        separator={<RightOutlined />}
                        items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Tenants' }]}
                    />
                    {isFetching && (
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    )}
                    {isError && <Typography.Text type="danger">{error.message}</Typography.Text>}
                </Flex>

                <Form form={filterForm} onFieldsChange={onFilterChange}>
                    <TenantFilter>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setDrawerOpen(true)}>
                            Add Restaurant
                        </Button>
                    </TenantFilter>
                </Form>

                <Table
                    columns={columns}
                    dataSource={tenants?.data}
                    rowKey={'id'}
                    pagination={{
                        total: tenants?.total,
                        pageSize: queryParams.perPage,
                        current: queryParams.currentPage,
                        onChange: (page) => {
                            console.log(page);
                            setQueryParams((prev) => {
                                return {
                                    ...prev,
                                    currentPage: page,
                                };
                            });
                        },
                    }}
                />

                <Drawer
                    title="Create restaurant"
                    styles={{ body: { backgroundColor: colorBgLayout } }}
                    width={720}
                    destroyOnClose={true}
                    open={drawerOpen}
                    onClose={() => {
                        setDrawerOpen(false);
                    }}
                    extra={
                        <Space>
                            <Button
                                onClick={() => {
                                    form.resetFields();
                                    setDrawerOpen(false);
                                }}>
                                Cancel
                            </Button>
                            <Button type="primary" onClick={onHandleSubmit}>
                                Submit
                            </Button>
                        </Space>
                    }>
                    <Form layout="vertical" form={form}>
                        <TenantForm />
                    </Form>
                </Drawer>
            </Space>
        </>
    );
};

export default Tenants;
