import { Row, Col,type FormInstance, Space, Card, Form, Input, Select, Switch, Typography } from "antd"

import type { Category, Tenant } from "../../../types"
import { getCategories, getTenants } from "../../../http/Api"
import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "../../../Store"
import Pricing from "./Pricing"
import Attributes from "./Attributes"
import ProductImage from "./ProductImage"


const ProductForm = ({ form }: { form: FormInstance }) => {
    const {user} = useAuthStore();
    const selectedCategory=Form.useWatch('categoryId');//here we are selecting what value is selected in the category dropdown

    console.log("selectedCategory", selectedCategory);
    const{data:categories}=useQuery({
        queryKey: ['categories'],
        queryFn: () => {
            return getCategories(); // Fetch categories from API
        }
    });

    const {data:restaurants} = useQuery({
        queryKey: ['restaurants'],
        queryFn: () => {
            return getTenants(`perPage=100&currentPage=1`); // Fetch tenants from API
        }
    });
  return (
    <>
    <Row>
            <Col span={24}>
                <Space direction="vertical" size="large">
                    <Card title="Product info" bordered={false}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item
                                    label="Product name"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Product name is required',
                                        },
                                    ]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Category"
                                    name="categoryId"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Category is required',
                                        },
                                    ]}>
                                    <Select
                                        size="large"
                                        style={{ width: '100%' }}
                                        allowClear={true}
                                        onChange={() => {}}
                                        placeholder="Select category">
                                        {categories?.data.map((category: Category) => (
                                            <Select.Option value={category._id} key={category._id}>
                                                {category.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Description"
                                    name="description"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Description is required',
                                        },
                                    ]}>
                                    <Input.TextArea
                                        rows={2}
                                        maxLength={100}
                                        style={{ resize: 'none' }}
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="Product image" bordered={false}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <ProductImage initialImage={form.getFieldValue('image')} />
                            </Col>
                        </Row>
                    </Card>
                    {user?.role !== 'manager' && (
                        <Card title="Tenant info" bordered={false}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        label="Restaurant"
                                        name="tenantId"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Restaurant is required',
                                            },
                                        ]}>
                                        <Select
                                            size="large"
                                            style={{ width: '100%' }}
                                            allowClear={true}
                                            onChange={() => {}}
                                            placeholder="Select restaurant">
                                            {restaurants?.data.data.map((tenant: Tenant) => (
                                                <Select.Option
                                                    value={String(tenant.id)}
                                                    key={tenant.id}>
                                                    {tenant.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    )}

                     {selectedCategory && <Pricing selectedCategory={selectedCategory} />}
                    {selectedCategory && <Attributes selectedCategory={selectedCategory} />}

                    <Card title="Other properties" bordered={false}>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Space>
                                    <Form.Item name="isPublish">
                                        <Switch
                                            defaultChecked={false}
                                            onChange={() => {}}
                                            checkedChildren="Yes"
                                            unCheckedChildren="No"
                                        />
                                    </Form.Item>
                                    <Typography.Text style={{ marginBottom: 22, display: 'block' }}>
                                        Published
                                    </Typography.Text>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Space>
            </Col>
        </Row>
    </>
  )
}

export default ProductForm