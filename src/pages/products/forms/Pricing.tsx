import { Card, Col, Form, InputNumber, Row, Space, Typography } from 'antd';

import { useQuery } from '@tanstack/react-query';
import type { Category } from '../../../types';
import { getCategory } from '../../../http/Api';


type PricingProps = {
    selectedCategory: string;
};

const Pricing = ({ selectedCategory }: PricingProps) => {
    const { data: fetchedCategory } = useQuery<Category>({
        queryKey: ['category', selectedCategory],
        queryFn: () => {
            return getCategory(selectedCategory).then((res) => res.data);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
    // You can log fetchedCategory here if needed
    //object.entries returns key-value pairs of an object
    console.log("fetchedCategory", fetchedCategory);

    if (!fetchedCategory) return null;

    return (
        <Card title={<Typography.Text>Product price</Typography.Text>} bordered={false}>
            {Object.entries(fetchedCategory?.priceConfiguration).map(
                ([configurationKey, configurationValue]) => {
                    return (
                        <div key={configurationKey}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Typography.Text>
                                    {`${configurationKey} (${configurationValue.priceType})`}
                                </Typography.Text>

                                <Row gutter={20}>
                                    {configurationValue.availableOptions.map((option: string) => {
                                        return (
                                            <Col span={8} key={option}>
                                                <Form.Item
                                                    label={option}
                                                    name={[
                                                        'priceConfiguration',
                                                        JSON.stringify({
                                                            configurationKey: configurationKey,
                                                            priceType: configurationValue.priceType,
                                                        }),
                                                        option,
                                                    ]}>
                                                    <InputNumber addonAfter="₹" />
                                                </Form.Item>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Space>
                        </div>
                    );
                }
            )}
        </Card>
    );
};

export default Pricing;
