import React from "react";
import { Spin } from "antd";

export const Spinner = () => {
  return (
    <div
      className="spinner"
      style={{
        width: "100%",
        minHeight: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin size="large" />
    </div>
  );
};
