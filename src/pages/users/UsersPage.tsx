import { Breadcrumb, Space, Table } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getUsers } from "../../http/Api";
import { useQuery } from "@tanstack/react-query";
import type { User } from "../../types";

//This column is taken from table component go to ant design and verify
const columnsData=[
   {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'firstName',
        key: 'firstName',
        render: (_text: string, record: User) => {
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
]

const UsersPage = () => {
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return getUsers().then((res) => {
        console.log("Full API Response:", res.data);//In Axios, res.data gives you the whole response body
        console.log("Extracted Users Array:", res.data.data);
        return res.data.data;
      });
    },
  });
  
  return (
    <>
    <Space direction="vertical" size="large" style={{width:"100%"}}>
          <Breadcrumb
        separator={<RightOutlined />}
        items={[
          { title: <Link to="/">Dashboard</Link> },
          { title: "Users" },
        ]}
      />
      {isLoading && <div>Loading...</div>}
      {isError && <div>{(error as Error).message}</div>}
      
      <Table  columns={columnsData} dataSource={users}/>
    </Space>
      
      
    </>
  );
};

export default UsersPage;
