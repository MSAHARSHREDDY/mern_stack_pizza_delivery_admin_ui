import { Card, Col, Form, Input, Row, Select, Space } from 'antd'
import { getTenants } from '../../../http/Api';
import { useQuery } from '@tanstack/react-query';
import type { Tenant } from '../../../types';

const UserForm = ({ isEditMode = false }: { isEditMode: boolean }) => {
const selectedRole = Form.useWatch('role');//here "role" is taken from name attribute from role line number 99
console.log("seleted role",selectedRole)
const { data: tenants } = useQuery({
        queryKey: ['tenants'],
        queryFn: () => {
            
           // TODO: make this dynamic, like search for tenants in the input
            return getTenants(`perPage=100&currentPage=1`).then((res) => res.data);
        },
        /**
         * You can also write like this also
         * queryFn:async()=>{
            const result=await getTenants(`perPage=100&currentPage=1`)// Here we are calling getTenants from api.tsx
            console.log("Tenants Data",result.data)
            return result.data
        }
         */
    });

  return (
    <>
        <Row>
             <Col span={24}>
                <Space direction="vertical" size="large">

                    <Card title="Basic info" bordered={false}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item
                                    label="First name"
                                    name="firstName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'First name is required',
                                        },
                                    ]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label="Last name"
                                    name="lastName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Last name is required',
                                        },
                                    ]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Email is required',
                                        },
                                        {
                                            type: 'email',
                                            message: 'Email is not valid',
                                        },
                                    ]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    
                    {/**When you click on edit option the password is going to hide */}
                    {!isEditMode && (
                        <Card title="Security info" bordered={false}>
                            <Row gutter={20}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Passoword"
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Password required',
                                            },
                                        ]}>
                                        <Input size="large" type="password" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    )}

                    <Card title="Role" bordered={false}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item
                                    label="Role"
                                    name="role"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Role is required',
                                        },
                                    ]}>
                                    <Select
                                        id="selectBoxInUserForm"
                                        size="large"
                                        style={{ width: '100%' }}
                                        allowClear={true}
                                        onChange={() => {}}
                                        placeholder="Select role">
                                        <Select.Option value="admin">Admin</Select.Option>
                                        <Select.Option value="manager">Manager</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                           
                            {/*If selected role is manager then only it is going to display*/}
                            {selectedRole === 'manager' && (
                                <Col span={12}>
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
                                            {tenants?.data.map((tenant: Tenant) => (
                                                <Select.Option value={tenant.id} key={tenant.id}>
                                                    {tenant.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            )}
                            
                        </Row>
                    </Card>

                </Space>
            </Col>
        </Row>
    </>
  )
}

export default UserForm