import {
    Breadcrumb,
    Button,
    Drawer,
    Flex,
    Form,
    Image,
    Space,
    Spin,
    Table,
    Tag,
    theme,
    Typography,
} from 'antd';
import { format } from 'date-fns';
import { RightOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';

import type { FieldData, Product } from '../../types';
import { Link } from 'react-router-dom';
import ProductsFilter from './ProductsFilter';
import { getProducts } from '../../http/Api';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../Store';
import React from 'react';
import { PER_PAGE } from '../../Constants';
import { debounce } from 'lodash';
import ProductForm from './forms/ProductForm';

const columns = [
    {
        title: 'Product Name',
        dataIndex: 'name',
        key: 'name',
        render: (_text: string, record: Product) => {
            return (
                <div>
                    <Space>
                        <Image width={60} src={record.image}  />
                        <Typography.Text>{record.name}</Typography.Text>
                    </Space>
                </div>
            );
        },
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Status',
        dataIndex: 'isPublish',
        key: 'isPublish',
        render: (_: boolean, record: Product) => {
            return (
                <>
                    {record.isPublish ? (
                        <Tag color="green">Published</Tag>
                    ) : (
                        <Tag color="red">Draft</Tag>
                    )}
                </>
            );
        },
    },
    {
        title: 'CreatedAt',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => {
            return <Typography.Text>{format(new Date(text), 'dd/MM/yyyy HH:mm')}</Typography.Text>;
        },
    },
];

const ProductsPage = () => {
    const [form]=Form.useForm()//This form is taken from ant design, and it is going to get complete user input values
    const [filterForm] = Form.useForm();
    const [selectedProduct, setCurrentProduct] = React.useState<Product | null>(null);

     const { user } = useAuthStore();

    const {
        token: { colorBgLayout },
    } = theme.useToken();
    //It is used to open the drawer
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const [queryParams, setQueryParams] = React.useState({
        limit: PER_PAGE,
        page: 1,
        tenantId: user!.role === 'manager' ? user?.tenant?.id : undefined,
    });

    /*********Here we are fetching out the products***********/
    const {
        data: products,
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: ['products', queryParams],
        queryFn: () => {
            const filteredParams = Object.fromEntries(
                Object.entries(queryParams).filter((item) => !!item[1])
            );

            const queryString = new URLSearchParams(
                filteredParams as unknown as Record<string, string>
            ).toString();
            return getProducts(queryString).then((res) => res.data);
        },
        placeholderData: keepPreviousData,
    });

      const debouncedQUpdate = React.useMemo(() => {
        return debounce((value: string | undefined) => {
            setQueryParams((prev) => ({ ...prev, q: value, page: 1 }));
        }, 500);
    }, []);

    /***********Here filtering out the data************/
    const onFilterChange = (changedFields: FieldData[]) => {
        console.log('changedFields', changedFields);
        const changedFilterFields = changedFields
            .map((item) => ({
                [item.name[0]]: item.value,
            }))
            .reduce((acc, item) => ({ ...acc, ...item }), {});
        console.log('changedFilterFields key and value', changedFilterFields);
        if ('q' in changedFilterFields) {
            debouncedQUpdate(changedFilterFields.q);
        } else {
            setQueryParams((prev) => ({ ...prev, ...changedFilterFields, page: 1 }));
        }
    };

    //It is used for edit and create a product
    const {mutate:productMutate,isPending:isCreateLoading}=useMutation({

    })

    const onHandleSubmit = async () => {
        // const dummy = {
        //     Size: { priceType: 'base', availableOptions: { Small: 400, Medium: 600, Large: 800 } },
        //     Crust: { priceType: 'aditional', availableOptions: { Thin: 50, Thick: 100 } },
        // };

        // const currentData = {
        //     '{"configurationKey":"Size","priceType":"base"}': {
        //         Small: 100,
        //         Medium: 200,
        //         Large: 400,
        //     },
        //     '{"configurationKey":"Crust","priceType":"aditional"}': {
        //         Thin: 0,
        //         Thick: 50,
        //     },
        // };

        
    };

  return (
    <>
         <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Flex justify="space-between">
                    <Breadcrumb
                        separator={<RightOutlined />}
                        items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Products' }]}/>

                    {isFetching && (
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    )}
                    {isError && <Typography.Text type="danger">{error.message}</Typography.Text>}
            </Flex>
            
            {/**It is used for filtering out the data */}
              <Form form={filterForm} onFieldsChange={onFilterChange}>
                    <ProductsFilter>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                 setDrawerOpen(true);;
                            }}>
                            Add Product
                        </Button>
                    </ProductsFilter>
                </Form>

                {/**It is used for displaying the data in table format */}
                <Table
                    columns={[
                        ...columns,
                        {
                            title: 'Actions',
                            render: (_, record: Product) => {
                                return (
                                    <Space>
                                        <Button
                                            type="link"
                                            onClick={() => {
                                               setCurrentProduct(record)
                                            }}>
                                            Edit
                                        </Button>
                                    </Space>
                                );
                            },
                        },
                    ]}
                    dataSource={products?.data}
                    rowKey={'id'}
                    pagination={{
                        total: products?.total,
                        pageSize: queryParams.limit,
                        current: queryParams.page,
                        onChange: (page) => {
                            //console.log(page);
                            setQueryParams((prev) => {
                                return {
                                    ...prev,
                                    page: page,
                                };
                            });
                        },
                        showTotal: (total: number, range: number[]) => {
                            //console.log(total, range);
                            return `Showing ${range[0]}-${range[1]} of ${total} items`;
                        },
                    }}
                />

                {/****It is used for opening drawer ****/}
                <Drawer
                    title={selectedProduct ? 'Update Product' : 'Add Product'}
                    width={720}
                    styles={{ body: { backgroundColor: colorBgLayout } }}
                    destroyOnClose={true}
                    open={drawerOpen}
                    onClose={() => {
                        setCurrentProduct(null);
                        form.resetFields();//Resetting the form fields once you you click on "x" button
                        setDrawerOpen(false);
                    }}
                    extra={
                        <Space>
                            <Button
                                onClick={() => {
                                    setCurrentProduct(null);
                                    form.resetFields();
                                    setDrawerOpen(false);
                                }}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                onClick={onHandleSubmit}
                                loading={isCreateLoading}>
                                Submit
                            </Button>
                        </Space>
                    }>
                        {/**It is used for displaying product form */}
                    <Form layout="vertical" form={form}>
                        <ProductForm form={form} />
                    </Form>
                </Drawer>

         </Space>
    </>
  )
}

export default ProductsPage