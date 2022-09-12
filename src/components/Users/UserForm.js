import React from "react";
import { Modal, Form, Input } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUserByOrgIdAndEmail } from "../../apis/userApi";
import { useOrgState } from "../../store/orgState";

export const UserForm = ({ visible, setVisible, getUsersKey }) => {
  const [form] = Form.useForm();
  const [orgState] = useOrgState();
  const queryClient = useQueryClient();
  const addUser = useMutation((values) => addUserByOrgIdAndEmail(values));

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    const { userEmail, userName } = values;
    addUser.mutate(
      { orgId: orgState?.id, userEmail, userName },
      {
        onSuccess: async () => {
          await queryClient.refetchQueries(getUsersKey);
        },
      }
    );
    setVisible(false);
    form.resetFields();
  };

  return (
    <>
      <Modal
        title="ADD USER"
        centered
        visible={visible}
        onOk={form.submit}
        onCancel={handleCancel}
        width="555px"
        okText="Send Email"
        cancelText="Close"
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name={"userName"}
            const
            rules={[
              {
                required: true,
                message: "Please input the Name",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name={"userEmail"}
            const
            rules={[
              {
                required: true,
                message: "Please input the email",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
