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
import { createProduct, getProducts, updateProduct } from '../../http/Api';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../Store';
import React from 'react';
import { PER_PAGE } from '../../Constants';
import { debounce } from 'lodash';
import ProductForm from './forms/ProductForm';
import { makeFormData } from './helpers';


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

    //It is used for when you click on edit button
    React.useEffect(() => {
        if (selectedProduct) {
            setDrawerOpen(true);

            //console.log('seletedProduct', selectedProduct);

            const priceConfiguration = Object.entries(selectedProduct.priceConfiguration).reduce(
                (acc, [key, value]) => {
                    const stringifiedKey = JSON.stringify({
                        configurationKey: key,
                        priceType: value.priceType,
                    });

                    return {
                        ...acc,
                        [stringifiedKey]: value.availableOptions,
                    };
                },
                {}
            );

            const attributes = selectedProduct.attributes.reduce((acc, item) => {
                return {
                    ...acc,
                    [item.name]: item.value,
                };
            }, {});

            form.setFieldsValue({
                ...selectedProduct,
                priceConfiguration,
                attributes,
                // todo: fix this
                categoryId: selectedProduct.category._id,
            });
        }
    }, [selectedProduct, form]);

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
    const queryClient = useQueryClient();
    const { mutate: productMutate, isPending: isCreateLoading } = useMutation({
        mutationKey: ['product'],
        mutationFn: async (data: FormData) => {
            if (selectedProduct) {
                // edit mode
                return updateProduct(data, selectedProduct._id).then((res) => res.data);
            } else {
                return createProduct(data).then((res) => res.data);
            }
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });//Here we are updating the product after click on submit button
            form.resetFields();
            setDrawerOpen(false);
            return;
        },
    });

    //onHandleSubmit function is used to handle the form submission
    const onHandleSubmit = async () => {
        // const backend_data = {
        //     Size: { priceType: 'base', availableOptions: { Small: 400, Medium: 600, Large: 800 } },
        //     Crust: { priceType: 'aditional', availableOptions: { Thin: 50, Thick: 100 } },
        // };

        // const frontend_data = {
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

        //Now we are going to convert the frontend_data to backend_data format

        //console.log("form", form.getFieldsValue());
        await form.validateFields();//here we are validating the form fields

        const priceConfiguration = form.getFieldValue('priceConfiguration');
        const pricing = Object.entries(priceConfiguration).reduce((acc, [key, value]) => {
            //Here key is {"configurationKey":"Size","priceType":"base"}
            //Here value is { Small: 100, Medium: 200, Large: 400 }
            const parsedKey = JSON.parse(key);
            return {
                ...acc,
                [parsedKey.configurationKey]: { //Here [parsedKey.configurationKey] we are getting "size" keeping [] meaning dynamically setting parsedKey.configurationKey value
                    priceType: parsedKey.priceType,
                    availableOptions: value,//Here value is { Small: 100, Medium: 200, Large: 400 }
                },
            };
        }, {});

        //console.log("pricing", pricing);
        const categoryId = form.getFieldValue('categoryId');
        // const backend_end_attributes = {
        //     isHit: 'No',
        //     Spiciness: 'Less',
        // };

        // const front_end_attributes = [
        //     { name: 'Is Hit', value: true },
        //     { name: 'Spiciness', value: 'Hot' },
        // ];

         //Now we are going to convert the front_end_attributes to backend_end_attributes format

        const attributes = Object.entries(form.getFieldValue('attributes')).map(([key, value]) => {
            return {
                name: key,
                value: value,
            };
        });
        //console.log("attributes", attributes);
        const postData = {
            ...form.getFieldsValue(),
            tenantId: user!.role === 'manager' ? user?.tenant?.id : form.getFieldValue('tenantId'),
            isPublish: form.getFieldValue('isPublish') ? true : false,
            image: form.getFieldValue('image'),
            categoryId,
            priceConfiguration: pricing,
            attributes,
        };

        const formData = makeFormData(postData);//As in our backend we are sending data in form-data format you can look in to postmon, so we are using makeFormData function to convert the postData to form-data format
        //console.log('formData', formData);
        productMutate(formData);
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
                                        <Button
                                            type="link"
                                            danger
                                            onClick={async () => {
                                                // Confirm before deleting
                                                if (window.confirm('Are you sure you want to delete this product?')) {
                                                    try {
                                                        await import('../../http/Api').then(({ deleteProduct }) =>
                                                            deleteProduct(record._id)
                                                        );
                                                        queryClient.invalidateQueries({ queryKey: ['products'] });//It is used for updating the latest data
                                                    } catch (err) {
                                                        // Optionally show error
                                                        // eslint-disable-next-line no-alert
                                                        alert('Failed to delete product');
                                                    }
                                                }
                                            }}
                                        >
                                            Delete
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
                        {/**
                         <Form form={form}> tells AntD Form to use that form instance
                        <ProductForm form={form} /> allows the child component to also access and interact with the same form
                         */}
                    <Form layout="vertical" form={form}>
                        <ProductForm form={form} />{/**left side form is name of the prop and right form is all user input values*/}
                    </Form>
                </Drawer>

         </Space>
    </>
  )
}

export default ProductsPage