import React from "react";
import { Form, Input, Select, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTicketByDetails } from "../../apis/ticketApi";
import { useUserState } from "../../store/userState";

export const TicketForm = ({
  visible,
  setVisible,
  orgId,
  usersData,
  customersData,
  getUsersKey,
  getAllTicketsKey,
  getCustomersKey,
  getFilteredTicketsKey,
}) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [userState] = useUserState();
  const addTicket = useMutation((values) => addTicketByDetails(values));

  const handleSubmit = (values) => {
    const newValues = {
      newTicketDetails: { ticketDetails: { ...values } },
      orgId,
    };
    addTicket.mutate(newValues, {
      onSuccess: async () => {
        await queryClient.refetchQueries(getUsersKey);
        await queryClient.refetchQueries(getCustomersKey);
        if (getFilteredTicketsKey.length) {
          await queryClient.refetchQueries(getFilteredTicketsKey);
        } else {
          await queryClient.refetchQueries(getAllTicketsKey);
        }
      },
    });
    setVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <>
      <Modal
        title="RAISE TICKET"
        centered
        visible={visible}
        onOk={form.submit}
        onCancel={handleCancel}
        width="700px"
        okText="Add Ticket"
        cancelText="Close"
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Title"
            name={"title"}
            const
            rules={[
              {
                required: true,
                message: "Please input the title",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name={"description"}
            const
            rules={[
              {
                required: true,
                message: "Please input the description",
              },
            ]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            label="RaisedBy"
            name={"customerId"}
            const
            rules={[
              {
                required: true,
                message: "Please select the user",
              },
            ]}
          >
            <Select>
              {customersData?.map((customer) => (
                <Select.Option value={customer.id} key={customer.id}>
                  {`${customer.name} <${customer.id}>`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {userState?.isAdmin && (
            <Form.Item
              label="AssignTo"
              name={"ownerId"}
              const
              rules={[
                {
                  required: true,
                  message: "Please assign a user | None",
                },
              ]}
            >
              <Select>
                {usersData.map(
                  (user) =>
                    !user.isAdmin && (
                      <Select.Option value={user.id} key={user.id}>
                        {`${user.name} <${user.id}>`}
                      </Select.Option>
                    )
                )}
                <Select.Option value={"null"}>None</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};
