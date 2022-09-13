import "../styles/RaiseTicketForm.css";
import React from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Typography, Button } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Spinner } from "../components/Spinner";
import { getOrganizationById } from "../apis/organizationApi";
import { addTicketByDetails } from "../apis/ticketApi";

export const RaiseTicketForm = () => {
  const params = useParams();
  const getOrg = useQuery(["get-org-by-id", params.orgId], getOrganizationById);
  const addTicket = useMutation((values) => addTicketByDetails(values));

  const handleSubmit = (values) => {
    console.log(values);
    addTicket.mutate(
      {
        newTicketDetails: {
          ticketDetails: {
            title: values.title,
            description: values.description,
          },
          customerEmail: values.customerEmail,
        },
        orgId: params.orgId,
      },
      {
        onError: () => {
          alert("Adding Ticket Failed!");
        },
        onSuccess: () => {
          alert("Ticket Raised");
        },
      }
    );
  };

  // console.log(getOrg.data);

  if (getOrg.isLoading)
    return (
      <>
        <Spinner />
      </>
    );

  if (getOrg.data.error) {
    return (
      <>
        <div
          className="no-org-fallback-title"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <Typography.Title>No Org with such OrgId</Typography.Title>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="raise-ticket-form-container">
        <Form onFinish={handleSubmit}>
          <div className="form-title">
            <Form.Item>
              <Typography.Title>
                Ticket Form : {getOrg?.data?.name && getOrg?.data?.name}
              </Typography.Title>
            </Form.Item>
          </div>

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
            label="Email"
            name={"customerEmail"}
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
          <div className="raise-ticket-submit-btn">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </>
  );
};
