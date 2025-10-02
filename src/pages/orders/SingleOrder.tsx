

import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Flex,
  List,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  Spin,
} from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { colorMapping } from '../../Constants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { changeStatus, getSingle } from '../../http/Api';
import { capitalizeFirst } from '../products/helpers';
import { format } from 'date-fns';
import { Order, OrderStatus } from '../../types';

const orderStatusOptions = [
  { value: 'received', label: 'Received' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'prepared', label: 'Prepared' },
  { value: 'out_for_delivery', label: 'Out For Delivery' },
  { value: 'delivered', label: 'Delivered' },
];

const SingleOrder = () => {
  const params = useParams();
  const orderId = params.orderId;

  /***Fetching single order-page */
  const {data: order,isLoading,isError} = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: () => {
      const queryString = new URLSearchParams({
        fields:
          'cart,address,paymentMode,tenantId,total,comment,orderStatus,paymentStatus,createdAt,customerId',
      }).toString();
      return getSingle(orderId as string, queryString).then((res) => res.data);
    },
  });
  //console.log("order",order)
  const queryClient = useQueryClient();


  /**Change-status** */
    const { mutate } = useMutation({
        mutationKey: ['order', orderId],
        mutationFn: (status: OrderStatus) => {//here we are passing the value of changed status
            return changeStatus(orderId as string, { status }).then((res) => res.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order', orderId] });//here we are refetching the order status and gets the updated values
        },
    });

    const handleStatusChange = (status: OrderStatus) => {
        //console.log("status changed to",status)
        mutate(status);
    };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ height: '60vh' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (isError || !order) {
    return (
      <Flex justify="center" align="center" style={{ height: '60vh' }}>
        <Typography.Text type="danger">
          Failed to load order details.
        </Typography.Text>
      </Flex>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: <Link to="/orders">Orders</Link> },
            { title: `Order #${order._id}` },
          ]}
        />

        <Space>
          <Typography.Text>Change Order Status</Typography.Text>
          <Select
            defaultValue={order.orderStatus}
            style={{ width: 150 }}
            onChange={handleStatusChange}
            options={orderStatusOptions}
          />
        </Space>
      </Flex>

      <Row gutter={24}>
        {/* Order details */}
        <Col span={14}>
          <Card
            title="Order Details"
            extra={
              <Tag
                bordered={false}
                color={colorMapping[order.orderStatus] ?? 'processing'}
              >
                {capitalizeFirst(order.orderStatus)}
              </Tag>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={order.cart}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.image} />}
                    title={item.name}
                    description={
                      // @ts-ignore selectedToppings is nested
                      item.chosenConfiguration.selectedToppings
                        ?.map((topping) => topping.name)
                        .join(', ') ?? 'No toppings'
                    }
                  />

                  <Space size="large">
                    <Typography.Text>
                      {Object.values(
                        item.chosenConfiguration.priceConfiguration
                      ).join(', ')}
                    </Typography.Text>

                    <Typography.Text>
                      {item.qty} Item{item.qty > 1 ? 's' : ''}
                    </Typography.Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Customer details */}
        <Col span={10}>
          <Card title="Customer Details">
            <Space direction="vertical">
              <Flex style={{ flexDirection: 'column' }}>
                <Typography.Text type="secondary">Name</Typography.Text>
                <Typography.Text>
                  {order.customerId?.firstName} {order.customerId?.lastName}
                </Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: 'column' }}>
                <Typography.Text type="secondary">Address</Typography.Text>
                <Typography.Text>{order.address}</Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: 'column' }}>
                <Typography.Text type="secondary">Payment Method</Typography.Text>
                <Typography.Text>
                  {order.paymentMode?.toUpperCase()}
                </Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: 'column' }}>
                <Typography.Text type="secondary">Payment Status</Typography.Text>
                <Typography.Text>
                  {capitalizeFirst(order.paymentStatus)}
                </Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: 'column' }}>
                <Typography.Text type="secondary">Order Amount</Typography.Text>
                <Typography.Text>₹{order.total}</Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: 'column' }}>
                <Typography.Text type="secondary">Order Time</Typography.Text>
                <Typography.Text>
                  {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                </Typography.Text>
              </Flex>

              {order.comment && (
                <Flex style={{ flexDirection: 'column' }}>
                  <Typography.Text type="secondary">Comment</Typography.Text>
                  <Typography.Text>{order.comment}</Typography.Text>
                </Flex>
              )}
            </Space>
          </Card>
        </Col>


      </Row>
    </Space>
  );
};

export default SingleOrder;
