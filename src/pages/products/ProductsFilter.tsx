
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from 'antd';

import { useAuthStore } from '../../Store';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getTenants } from '../../http/Api';
import type { Category, Tenant } from '../../types';

type ProductsFilterProps = {
    children?: React.ReactNode;
};
/**  useQuery	    Fetching (read) data	GET
useMutation	  Changing (write) data	POST, PUT, PATCH, DELETE */
const ProductsFilter = ({ children }: ProductsFilterProps) => {
    const {user} = useAuthStore();

    //Here we are fetching tenant Information
    const {data:restaurants}=useQuery({
        queryKey: ['restaurants'],
        queryFn:  () => {
            return getTenants(`perPage=100&currentPage=1`);
        }
    });
    //console.log("restaurants", restaurants);

    const{data:categories}=useQuery({
        queryKey:['categories'],
        queryFn:()=>{
            return getCategories();//here we are calling the api
        }
    })
    //console.log("categories", categories);
    return (
        <Card>
            <Row justify="space-between">
                <Col span={16}>
                    <Row gutter={20}>

                        <Col span={6}>
                            <Form.Item name="q">
                                <Input.Search allowClear={true} placeholder="Search" />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item name="categoryId">
                                <Select
                                    style={{ width: '100%' }}
                                    allowClear={true}
                                    placeholder="Select category">
                                   {
                                        categories?.data.map((category:Category) => (
                                            <Select.Option key={category._id} value={category._id}>
                                                {category.name}
                                            </Select.Option>
                                        ))
                                   }
                                </Select>
                            </Form.Item>
                        </Col>
                        {user!.role === 'admin' && (
                            <Col span={6}>
                                <Form.Item name="tenantId">
                                     <Select
                                        style={{ width: '100%' }}
                                        allowClear={true}
                                        placeholder="Select restaurant">
                                        {
                                            restaurants?.data.data.map((restaurant:Tenant)=>(
                                                <Select.Option key={restaurant.id} value={restaurant.id}>
                                                    {restaurant.name}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        )}

                        <Col span={6}>
                            <Space>
                                <Form.Item name="isPublish">
                                    <Switch defaultChecked={false} onChange={() => {}} />
                                </Form.Item>
                                <Typography.Text style={{ marginBottom: 22, display: 'block' }}>
                                    Show only published
                                </Typography.Text>
                            </Space>
                        </Col>
                    </Row>
                </Col>
                <Col span={8} style={{ display: 'flex', justifyContent: 'end' }}>
                    {children}
                </Col>
            </Row>
        </Card>
    );
};

export default ProductsFilter;
