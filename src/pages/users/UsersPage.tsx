import { Breadcrumb } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getUsers } from "../../http/Api";
import { useQuery } from "@tanstack/react-query";
import type { User } from "../../types";

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
      <Breadcrumb
        separator={<RightOutlined />}
        items={[
          { title: <Link to="/">Dashboard</Link> },
          { title: "Users" },
        ]}
      />
      {isLoading && <div>Loading...</div>}
      {isError && <div>{(error as Error).message}</div>}

      {Array.isArray(users) && (
        <div>
          <h1>Users</h1>
          <ul>
            {users.map((user: User) => (
              <li key={user.id}>{user.firstName}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default UsersPage;
