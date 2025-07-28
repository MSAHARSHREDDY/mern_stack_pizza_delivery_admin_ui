


import { Card, Col, Form, Input, Row } from 'antd';

type TenantsFilterProps = {
    children?: React.ReactNode;//In TypeScript, React.ReactNode is a type that represents anything that can be rendered by React.like it can be number,string,jsx,null,undefined,boolean etc
};
const TenantFilter = ({ children }: TenantsFilterProps) => {
    return (
        <Card>
            <Row justify="space-between">
                <Col span={16}>
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item name="q">
                                <Input.Search allowClear={true} placeholder="Search" />
                            </Form.Item>
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

export default TenantFilter;

