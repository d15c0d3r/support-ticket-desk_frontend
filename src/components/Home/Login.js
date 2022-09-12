import "../../styles/Login.css";
import React, { useState } from "react";
import { GoogleOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import { auth } from "../../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const Login = () => {
  const [loading, setLoading] = useState(false);

  const enterLoading = (index) => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // console.log(result);
      })
      .catch((error) => {
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // console.log(error);
        // ...
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <div className="site-card-border-less-wrapper">
        <Card
          title={
            <Typography.Title level={2}>
              Please login to continue
            </Typography.Title>
          }
          bordered={false}
          className="login-card"
        >
          <Button
            type="primary"
            className="login-btn"
            size="large"
            icon={<GoogleOutlined />}
            loading={loading}
            onClick={() => enterLoading(1)}
          >
            Login W/ Google
          </Button>
        </Card>
      </div>
    </>
  );
};
