import React, { useEffect } from "react";
import { Button, Form, Input, Card, Typography } from "antd";
import { useMutation } from "@tanstack/react-query";
import { addOrganization } from "../../apis/organizationApi";
import { useOrgState } from "../../store/orgState";
import { Spinner } from "../Spinner";

export const OrganizationForm = () => {
  const [setorgState] = useOrgState();
  const addOrg = useMutation((values) => addOrganization(values));

  useEffect(() => {
    if (addOrg.data?.id) {
      setorgState(addOrg.data);
    }
  }, [addOrg.data, addOrg.isSuccess, setorgState]);

  const onFinish = (values) => {
    console.log({ addOrgRequest: values });
    addOrg.mutate(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  if (addOrg.isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Card
        title={
          <Typography.Title level={2}>
            Create an Organization to continue
          </Typography.Title>
        }
        bordered={false}
        className="login-card"
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="organizationName"
            rules={[
              {
                required: true,
                message: "Input your organization name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};
