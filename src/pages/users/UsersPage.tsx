
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
import { createUser, getUsers, updateUser, deleteUser } from "../../http/Api";
import type { CreateUserData, FieldData, User } from '../../types';
import { useAuthStore } from '../../Store';
import UsersFilter from './UsersFilter';
import React from 'react';
import UserForm from './forms/UserForm';
import { PER_PAGE } from '../../Constants';
import { debounce } from 'lodash';

const columnsData = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'firstName',
        key: 'firstName',
        render: (_text: string, record: User) => {//here we are combining firstName and lastName
            return (
                <div>
                    {record.firstName} {record.lastName}
                </div>
            );
        },
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
    },
    {
        title: 'Restaurant',
        dataIndex: 'tenant',
        key: 'tenant',
        render: (_text: string, record: User) => {
            return <div>{record.tenant?.name}</div>;
        },
    },
];

const UsersPage = () => {
    const [form]=Form.useForm()//This form is taken from ant design, and it is going to get complete user input values
    const [filterForm] = Form.useForm();

    const [currentEditingUser, setCurrentEditingUser] = React.useState<User | null>(null);

    const queryClient = useQueryClient();
    const {
        token: { colorBgLayout },
    } = theme.useToken();

    const [queryParams, setQueryParams] = React.useState({
        perPage: PER_PAGE,
        currentPage: 1,
    });

    const [drawerOpen, setDrawerOpen] = React.useState(false);

    //It is used to run when on click on edit option in a table
    React.useEffect(() => {
        if (currentEditingUser) {
            console.log('currentEditingUser', currentEditingUser);
            setDrawerOpen(true);
            form.setFieldsValue({ ...currentEditingUser, tenantId: currentEditingUser.tenant?.id });
        }
    }, [currentEditingUser, form]);

    {/*Here we are going to fetch users from database*/}
    const {
        data: users,
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: ['users', queryParams],
        queryFn: () => {
            const filteredParams = Object.fromEntries(
                Object.entries(queryParams).filter((item) => !!item[1])
            );

            const queryString = new URLSearchParams(
                filteredParams as unknown as Record<string, string>
            ).toString();
            return getUsers(queryString).then((res) => res.data);
        },
        placeholderData: keepPreviousData,//It is feature from react query where,it is going to wait until new data is going to fetch from database
    });

    const { user } = useAuthStore();

    //Here after form is submitted we are posting data to the backend
    const { mutate: userMutate } = useMutation({
        mutationKey: ['user'],
        mutationFn: async (data: CreateUserData) => createUser(data).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });//again we need to fetch user data to display we need to write like this,so that it calls new user data
            return;
        },
    });

    //It is used for updating user data
    const { mutate: updateUserMutation } = useMutation({
        mutationKey: ['update-user'],
        mutationFn: async (data: CreateUserData) =>
            updateUser(data, currentEditingUser!.id).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });//It is used to update the user table after updating a user
            setCurrentEditingUser(null);//once you update it clear all the values
            return;
        },
    });

    //It is used for deleting user data
    const { mutate: deleteUserMutation } = useMutation({
        mutationKey: ['delete-user'],
        mutationFn: async (id: string) => deleteUser(id).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });//It is used to update the user table after deleting a user
            return;
        },
    });

     //It is used for form submission taken from  input fields from user
    const onHandleSubmit = async () => {
        await form.validateFields();//validating input fields before submitting 
        const isEditMode = !!currentEditingUser;//it it is in editable
        if (isEditMode) {
            await updateUserMutation(form.getFieldsValue());
        } else {
            await userMutate(form.getFieldsValue());
        }
        form.resetFields();//once you submit it clear all the values
        setCurrentEditingUser(null);
        setDrawerOpen(false);//we are closing the drawer after submitting
    };

    const debouncedQUpdate = React.useMemo(() => {
        return debounce((value: string | undefined) => {
            setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
        }, 500);
    }, []);

    const onFilterChange = (changedFields: FieldData[]) => {
      console.log("changedFields",changedFields)
        const changedFilterFields = changedFields
            .map((item) => ({
                [item.name[0]]: item.value,
            }))
            .reduce((acc, item) => ({ ...acc, ...item }), {});

        if ('q' in changedFilterFields) {
            debouncedQUpdate(changedFilterFields.q);//it is used to wait until your search is completed in input, then it sends to backend api
        } else {
            setQueryParams((prev) => ({ ...prev, ...changedFilterFields, currentPage: 1 }));
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
                        items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Users' }]}
                    />
                    {isFetching && (
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    )}
                    {isError && <Typography.Text type="danger">{error.message}</Typography.Text>}
                </Flex>
                
                {/**By using this form in userFilter how many form attributes are there it is going to fetch */}
                {/**It is used to filter out the data from table */}
                <Form form={filterForm} onFieldsChange={onFilterChange}>
                    <UsersFilter>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setDrawerOpen(true)}>
                            Add User
                        </Button>
                    </UsersFilter>
                </Form>
                  

                {/**It is used for to display tables and fetch userdata from database  */}
                <Table
                    columns={[
                        ...columnsData,
                        {
                            title: 'Actions',
                            render: (_: string, record: User) => {
                                return (
                                    <Space>
                                        <Button
                                            type="link"
                                            onClick={() => {
                                                setCurrentEditingUser(record);
                                            }}>
                                            Edit
                                        </Button>

                                        <Button
                                            type="link"
                                            danger
                                            onClick={async () => {
                                                await new Promise<void>((resolve, reject) => {
                                                    // Optional: confirm before deleting
                                                    if (window.confirm('Are you sure you want to delete this user?')) {
                                                        resolve();
                                                    } else {
                                                        reject();
                                                    }
                                                })
                                                .then(() => {
                                                    deleteUserMutation(record.id);
                                                })
                                                .catch(() => {});
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Space>
                                );
                            },
                        },
                    ]}
                    dataSource={users?.data}//Here we are going to get the users table values from backend
                    rowKey={'id'}
                    pagination={{
                        total: users?.total,
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
                        showTotal: (total: number, range: number[]) => {
                            console.log(total, range);
                            return `Showing ${range[0]}-${range[1]} of ${total} items`;
                        },
                    }}
                />


                {/**It is used for displaying Drawer  */}
                <Drawer
                    title={currentEditingUser ? 'Edit User' : 'Add User'}
                    width={720}
                    styles={{ body: { backgroundColor: colorBgLayout } }}
                    destroyOnClose={true}
                    open={drawerOpen}
                    onClose={() => {
                        form.resetFields();//once you press "x" it clear all the values
                        setCurrentEditingUser(null);
                        setDrawerOpen(false);
                    }}
                    extra={
                        <Space>
                            <Button
                                onClick={() => {
                                    form.resetFields();//once you cancel it clear all the values
                                    setDrawerOpen(false);
                                }}>
                                Cancel
                            </Button>
                            <Button type="primary" onClick={onHandleSubmit}>
                                Submit
                            </Button>
                        </Space>
                    }>
                    {/**It is used for displaying user form */}
                    <Form layout="vertical" form={form}>
                        <UserForm isEditMode={!!currentEditingUser} />
                    </Form>

                </Drawer>
            </Space>
        </>
    );
};

export default UsersPage;
