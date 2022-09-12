import "../styles/Users.css";
import React, { useEffect, useState } from "react";
import { Table, Tag, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getAllUsersByOrgId } from "../apis/userApi";
import { useOrgState } from "../store/orgState";
import { CellUserName } from "../components/Users/CellUserName";
import { UserForm } from "../components/Users/UserForm";
import { Spinner } from "../components/Spinner";

export const Users = () => {
  const [orgState] = useOrgState();
  const getUsersKey = [`get-users`, orgState.id];
  const [visible, setVisible] = useState(false);
  const [usersTableData, setUsersTableData] = useState([]);
  const getUsers = useQuery(getUsersKey, getAllUsersByOrgId);

  useEffect(() => {
    if (getUsers.data && getUsers.isSuccess) {
      let data = getUsers.data.map((user, idx) => ({
        key: user.id,
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.isAdmin ? "Admin" : "User",
      }));
      setUsersTableData(data);
    }
  }, [getUsers.data, getUsers.isSuccess, getUsers.isLoading]);

  if (getUsers.isLoading) return <Spinner />;

  const columns = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
    },

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <CellUserName
          name={record.name}
          userId={record.userId}
          refetchUsersData={getUsers.refetch}
          key={record.key}
        />
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      key: "role",
      render: (_, record) => {
        let color = record.role === "Admin" ? "green" : "geekblue";
        return (
          <>
            <Tag color={color}>{record.role}</Tag>
          </>
        );
      },
    },
  ];

  const handleAddUser = () => {
    setVisible(true);
  };

  return (
    <>
      <div className="add-user-btn">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddUser}
          size="large"
        >
          Add User
        </Button>
        <UserForm
          visible={visible}
          setVisible={setVisible}
          getUsersKey={getUsersKey}
        />
      </div>
      <div className="users-table">
        <Table columns={columns} dataSource={usersTableData} />
      </div>
    </>
  );
};
