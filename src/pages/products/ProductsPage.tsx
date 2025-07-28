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

import type { Product } from '../../types';
import { Link } from 'react-router-dom';
import ProductsFilter from './ProductsFilter';

const columns = [
    {
        title: 'Product Name',
        dataIndex: 'name',
        key: 'name',
        render: (_text: string, record: Product) => {
            return (
                <div>
                    <Space>
                        <Image width={60} src={record.image} preview={false} />
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
  return (
    <>
         <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Flex justify="space-between">
                    <Breadcrumb
                        separator={<RightOutlined />}
                        items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Products' }]}/>

                    {/* {isFetching && (
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    )}
                    {isError && <Typography.Text type="danger">{error.message}</Typography.Text>} */}
            </Flex>
            
            {/**It is used for filtering out the data */}
              <Form form={filterForm} onFieldsChange={()=>{}}>
                    <ProductsFilter>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                ;
                            }}>
                            Add Product
                        </Button>
                    </ProductsFilter>
                </Form>

         </Space>
    </>
  )
}

export default ProductsPage