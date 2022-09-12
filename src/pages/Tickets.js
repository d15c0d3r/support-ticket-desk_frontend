import "../styles/Tickets.css";
import "../styles/Filters.css";
import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Pagination,
  Select,
  Form,
  DatePicker,
  Input,
} from "antd";
import { Spinner } from "../components/Spinner";
import { PlusOutlined } from "@ant-design/icons";
import { useOrgState } from "../store/orgState";
import { TicketCard } from "../components/Tickets/TicketCard";
import { useQuery } from "@tanstack/react-query";
import { getAllUsersByOrgId } from "../apis/userApi";
import { getAllTicketsByOrgIdandFilters } from "../apis/ticketApi";
import { getAllCustomersByOrgId } from "../apis/customerApi";
import { TicketForm } from "../components/Tickets/TicketForm";
import { useUserState } from "../store/userState";
import { useQueryClient } from "@tanstack/react-query";

export const Tickets = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [orgState] = useOrgState();
  const getUsersKey = [`get-users`, orgState.id];
  const getCustomersKey = [`get-customers`, orgState.id];
  const getAllTicketsKey = [`get-tickets`, orgState.id];
  const [userState] = useUserState();
  const [ticketsData, setTicketsData] = useState([]);
  const [getFilteredTicketsKey, setFilteredTicketsKey] = useState([]);
  const [visible, setVisible] = useState(false);
  const [minValue, setMinValue] = useState(0);
  const numEachPage = 3;
  const [maxValue, setMaxValue] = useState(numEachPage);
  const getUsers = useQuery(getUsersKey, getAllUsersByOrgId);
  const getCustomers = useQuery(getCustomersKey, getAllCustomersByOrgId);
  const getAllTickets = useQuery(
    getAllTicketsKey,
    getAllTicketsByOrgIdandFilters
  );
  const getFilteredTickets = useQuery(
    getFilteredTicketsKey,
    getAllTicketsByOrgIdandFilters
  );

  useEffect(() => {
    if (
      getAllTickets.isSuccess &&
      getAllTickets.isLoading === false &&
      getFilteredTicketsKey.length === 0
    ) {
      setTicketsData(getAllTickets.data);
    }
  }, [
    getAllTickets.data,
    getAllTickets.isLoading,
    getAllTickets.isSuccess,
    getFilteredTicketsKey,
  ]);

  useEffect(() => {
    getFilteredTickets.data &&
      !getFilteredTickets.data.error &&
      setTicketsData(getFilteredTickets.data);
  }, [getFilteredTickets.data, setTicketsData]);

  useEffect(() => {
    console.log("useEffect in Tickets");
    (async () => {
      if (getFilteredTicketsKey.length) {
        await queryClient.refetchQueries(getFilteredTicketsKey);
      }
    })();
  }, [getFilteredTicketsKey, queryClient]);

  const handleSubmit = (values) => {
    console.log(values);
    setFilteredTicketsKey(["get-filtered-tickets", orgState?.id, values]);
  };

  const handleResetFilters = async () => {
    form.resetFields();
    await queryClient.refetchQueries(getAllTicketsKey);
    setFilteredTicketsKey([]);
    await queryClient.refetchQueries(getUsersKey);
    await queryClient.refetchQueries(getCustomersKey);
  };

  const handlePageChange = (value) => {
    setMinValue((value - 1) * numEachPage);
    setMaxValue(value * numEachPage);
  };

  const handleAddTicketChange = () => {
    setVisible(true);
  };

  if (
    getUsers.isLoading ||
    getAllTickets.isLoading ||
    getCustomers.isLoading ||
    getFilteredTickets.isLoading
  ) {
    return <Spinner />;
  }

  return (
    <>
      <div className="ticket-container">
        <div className="addTicket-filters-btn-container">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleAddTicketChange}
            className="addTicket-filter-btn"
          >
            Add Ticket
          </Button>
          <TicketForm
            visible={visible}
            setVisible={setVisible}
            orgId={orgState.id}
            usersData={getUsers.data}
            customersData={getCustomers.data}
            getUsersKey={getUsersKey}
            getAllTicketsKey={getAllTicketsKey}
            getCustomersKey={getCustomersKey}
            getFilteredTicketsKey={getFilteredTicketsKey}
          />
        </div>
        <div className="container-filters">
          <Form onFinish={handleSubmit} form={form}>
            <div className="filter-form-search">
              <Form.Item label="Search" name="search">
                <Input />
              </Form.Item>
            </div>
            <div className="filter-form-container">
              <div className="ticket-status dropdown">
                <Form.Item label="Status" name="status">
                  <Select>
                    <Select.Option value="OPEN">Open</Select.Option>
                    <Select.Option value="CLOSE">Close</Select.Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="ticket-assigned-to dropdown">
                <Form.Item label="Assigned To" name={"assigned-to"}>
                  <Select>
                    {!userState?.isAdmin && (
                      <Select.Option value={"self"}>Me</Select.Option>
                    )}
                    {getUsers.data.map(
                      (user) =>
                        !(user.isAdmin || user.id === userState.id) && (
                          <Select.Option value={user.id} key={user.id}>
                            {`${user.name} <${user.id}>`}
                          </Select.Option>
                        )
                    )}
                    <Select.Option value={"null"}>None</Select.Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="startdate-enddate">
                <Form.Item label={"From -> To"} name={"range"}>
                  <DatePicker.RangePicker />
                </Form.Item>
              </div>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleResetFilters}>
                  Reset Filters
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
        <div className="header">
          <Typography.Title level={2}>
            Tickets : {orgState?.name}
          </Typography.Title>
        </div>
        <div className="container-tickets">
          <div className="content-tickets">
            {ticketsData &&
              ticketsData.length > 0 &&
              ticketsData.slice(minValue, maxValue).map((val, index) => {
                return (
                  <TicketCard
                    orgId={orgState.id}
                    val={val}
                    key={val.id}
                    usersData={getUsers.data}
                    customersData={getCustomers.data}
                    getUsersKey={getUsersKey}
                    getAllTicketsKey={getAllTicketsKey}
                    getCustomersKey={getCustomersKey}
                    getFilteredTicketsKey={getFilteredTicketsKey}
                  />
                );
              })}
          </div>
          <div className="tickets-pagination-container">
            <Pagination
              defaultCurrent={1}
              defaultPageSize={numEachPage} //default size of page
              onChange={handlePageChange}
              total={ticketsData?.length} //total number of card data available
            />
          </div>
        </div>
      </div>
    </>
  );
};
