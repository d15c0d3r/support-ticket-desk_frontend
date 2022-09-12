import "../../styles/TicketCard.css";
import React, { useEffect, useState } from "react";
import { Card, Typography, Menu, Dropdown, Button } from "antd";
import {
  DownCircleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserState } from "../../store/userState";
import { deleteTicketById, putTicketDetailsById } from "../../apis/ticketApi";
import { Spinner } from "../Spinner";

export const TicketCard = ({
  orgId,
  val,
  usersData,
  customersData,
  getUsersKey,
  getCustomersKey,
  getAllTicketsKey,
  getFilteredTicketsKey,
}) => {
  const queryClient = useQueryClient();
  const [userState] = useUserState();
  const checkIfEditable = userState?.id === val.ownerId || userState?.isAdmin;
  const [title, setTitle] = useState(val.title);
  const [description, setDescription] = useState(val.description);
  const [ticketStatus, setTicketStatus] = useState(val.status);
  const [assignedUser, setAssignedUser] = useState(val.ownerId || "NONE");
  const [raisedCustomer, setRaisedCustomer] = useState(val.customerId);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: val.title,
    description: val.description,
    ticketStatus: val.status,
    assignedUser: val.ownerId || "NONE",
    raisedCustomer: val.customerId,
  });
  console.log(usersData, assignedUser);
  const [updatedTicketDetails, setUpdatedTicketDetails] = useState({});
  const statusItems = [
    {
      label: "OPEN",
      key: "1",
      icon: <ClockCircleOutlined />,
    },
    {
      label: "CLOSE",
      key: "2",
      icon: <CheckCircleOutlined />,
    },
  ];

  let userItems = usersData.filter((userData) => !userData.isAdmin);
  userItems = userItems.map((userItem, idx) => ({
    label: `${userItem.name} <${userItem.id}>`,
    key: idx,
    id: userItem.id,
    icon: <UserOutlined />,
  }));
  userItems.push({
    label: "NONE",
    key: userItems.length,
    id: "NONE",
    icon: <CloseOutlined />,
  });

  let customerItems = customersData?.map((customerItem, idx) => ({
    label: `${customerItem.name} <${customerItem.id}>`,
    key: idx,
    id: customerItem.id,
    icon: <UserOutlined />,
  }));

  const findCustomerName = (customerId, customersData) => {
    const [customerDetails] = customersData.filter(
      (customer) => customer.id === customerId
    );
    console.log(customerDetails);
    return `${customerDetails.name} <${customerId}>`;
  };
  const findUserName = (userId, usersData) => {
    const [userDetails] = usersData.filter((user) => user.id === userId);
    console.log(userDetails);
    if (!userDetails) return assignedUser;
    return `${userDetails.name} <${userId}>`;
  };
  const updateTicket = useMutation((values) => putTicketDetailsById(values));
  const deleteTicket = useMutation((values) => deleteTicketById(values));

  useEffect(() => {
    updateTicket.data &&
      setInitialValues({
        title: updateTicket.data.ticket.title,
        description: updateTicket.data.ticket.description,
        ticketStatus: updateTicket.data.ticket.status,
        assignedUser: updateTicket.data.ticket.ownerId || "NONE",
        raisedCustomer: updateTicket.data.ticket.customerId,
      });
  }, [updateTicket.data]);

  useEffect(() => {
    initialValues.title !== title ||
    initialValues.description !== description ||
    initialValues.ticketStatus !== ticketStatus ||
    initialValues.assignedUser !== assignedUser ||
    initialValues.raisedCustomer !== raisedCustomer
      ? setShowSaveButton(true)
      : setShowSaveButton(false);
  }, [
    title,
    description,
    ticketStatus,
    assignedUser,
    raisedCustomer,
    initialValues,
  ]);

  useEffect(() => {
    if (initialValues.title !== title) {
      setUpdatedTicketDetails((prevTicketDetails) => ({
        ...prevTicketDetails,
        title,
      }));
    }
    if (initialValues.description !== description) {
      setUpdatedTicketDetails((prevTicketDetails) => ({
        ...prevTicketDetails,
        description,
      }));
    }
    if (initialValues.ticketStatus !== ticketStatus) {
      setUpdatedTicketDetails((prevTicketDetails) => ({
        ...prevTicketDetails,
        status: ticketStatus,
      }));
    }
    if (initialValues.assignedUser !== assignedUser && userState.isAdmin) {
      if (assignedUser === "NONE") {
        setUpdatedTicketDetails((prevTicketDetails) => ({
          ...prevTicketDetails,
          ownerId: null,
        }));
      } else {
        setUpdatedTicketDetails((prevTicketDetails) => ({
          ...prevTicketDetails,
          ownerId: assignedUser,
        }));
      }
    }
    if (initialValues.raisedCustomer !== raisedCustomer) {
      setUpdatedTicketDetails((prevTicketDetails) => ({
        ...prevTicketDetails,
        customerId: raisedCustomer,
      }));
    }
  }, [
    title,
    description,
    ticketStatus,
    assignedUser,
    raisedCustomer,
    initialValues,
    userState,
  ]);

  const handleUserMenuClick = (e) => {
    setAssignedUser(userItems[parseInt(e.key)].id);
  };

  const handleCustomerMenuClick = (e) => {
    setRaisedCustomer(customerItems[parseInt(e.key)].id);
  };

  const handleStatusMenuClick = (e) => {
    setTicketStatus(statusItems[parseInt(e.key) - 1].label);
  };

  const handleDeleteTicket = () => {
    deleteTicket.mutate(
      { orgId, ticketId: val.id },
      {
        onSuccess: async () => {
          setShowSaveButton(false);
          await queryClient.refetchQueries(getUsersKey);
          await queryClient.refetchQueries(getCustomersKey);
          if (getFilteredTicketsKey.length) {
            await queryClient.refetchQueries(getFilteredTicketsKey);
          } else {
            await queryClient.refetchQueries(getAllTicketsKey);
          }
        },
      }
    );
  };

  const handleSaveClick = (e) => {
    updateTicket.mutate(
      {
        orgId,
        ticketId: val.id,
        updatedTicketDetails: { ticketDetails: { ...updatedTicketDetails } },
      },
      {
        onSuccess: async () => {
          setShowSaveButton(false);
          await queryClient.refetchQueries(getUsersKey);
          await queryClient.refetchQueries(getCustomersKey);
          if (getFilteredTicketsKey.length) {
            await queryClient.refetchQueries(getFilteredTicketsKey);
          } else {
            await queryClient.refetchQueries(getAllTicketsKey);
          }
        },
      }
    );
  };

  const userMenu = (
    <Menu
      className="dropdown-menu"
      onClick={handleUserMenuClick}
      items={userItems}
    />
  );
  const customerMenu = (
    <Menu
      className="dropdown-menu"
      onClick={handleCustomerMenuClick}
      items={customerItems}
    />
  );
  const statusMenu = (
    <Menu
      className="dropdown-menu"
      onClick={handleStatusMenuClick}
      items={statusItems}
    />
  );

  if (updateTicket.isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="ticket-card-container">
        <Card
          title={
            <div className="ticket-card-title">
              <Typography.Text
                editable={
                  checkIfEditable
                    ? {
                        onChange: setTitle,
                      }
                    : false
                }
              >
                {title}
              </Typography.Text>
            </div>
          }
          hoverable={true}
          className="ticket-card"
        >
          <div className="ticket-card-content">
            <Typography.Paragraph
              editable={
                checkIfEditable
                  ? {
                      onChange: setDescription,
                    }
                  : false
              }
            >
              {description}
            </Typography.Paragraph>
            <div className="user-customer-details">
              <div className="user-customer-details-block">
                <Typography.Text>Assigned to </Typography.Text>
                {userState?.isAdmin ? (
                  <Dropdown.Button
                    className="user-customer-dropdown-button"
                    overlay={userMenu}
                    placement="bottom"
                    icon={<UserOutlined />}
                  >
                    {findUserName(assignedUser, usersData)}
                  </Dropdown.Button>
                ) : (
                  <Button
                    className="user-customer-dropdown-button"
                    placement="bottom"
                  >
                    {assignedUser === userState.id ? "You" : assignedUser}
                  </Button>
                )}
              </div>
              <div className="user-customer-details-block">
                <Typography.Text>Raised by </Typography.Text>
                {checkIfEditable ? (
                  <Dropdown.Button
                    className="user-customer-dropdown-button"
                    overlay={customerMenu}
                    placement="bottom"
                    icon={<UserOutlined />}
                  >
                    {findCustomerName(raisedCustomer, customersData)}
                  </Dropdown.Button>
                ) : (
                  <Button
                    className="user-customer-dropdown-button"
                    placement="bottom"
                  >
                    {raisedCustomer}
                  </Button>
                )}
              </div>
            </div>
            <div className="ticket-status-container">
              <Typography.Text>Ticket Status</Typography.Text>
              {checkIfEditable ? (
                <Dropdown.Button
                  className="alert-status-dropdown-button"
                  overlay={statusMenu}
                  placement="bottom"
                  icon={<DownCircleOutlined />}
                >
                  {ticketStatus}
                </Dropdown.Button>
              ) : (
                <Button
                  className="user-customer-dropdown-button"
                  placement="bottom"
                >
                  {ticketStatus}
                </Button>
              )}
            </div>

            <div className="ticket-card-footer">
              <div className="ticket-card-save-btn">
                {checkIfEditable && (
                  <Button onClick={handleDeleteTicket}>
                    <DeleteOutlined />
                  </Button>
                )}
                {showSaveButton && (
                  <Button
                    type="primary"
                    style={{
                      paddingLeft: "25px",
                      paddingRight: "25px",
                      marginLeft: "20px",
                    }}
                    onClick={handleSaveClick}
                  >
                    Save
                  </Button>
                )}
              </div>
              <div className="ticket-time-stamps-container">
                <div className="ticket-createdAt-container">
                  <Typography.Text disabled>
                    UPDATED `{val.updatedAt}`
                  </Typography.Text>
                </div>
                <div className="ticket-createdAt-container">
                  <Typography.Text disabled>
                    CREATED `{val.createdAt}`
                  </Typography.Text>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};
