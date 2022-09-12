import { React, useEffect, useState } from "react";
import { Typography, Button } from "antd";
import { useUserState } from "../../store/userState";
import { useOrgState } from "../../store/orgState";
import { useMutation } from "@tanstack/react-query";
import { putUserById } from "../../apis/userApi";
import "../../styles/CellUserName.css";
import { Spinner } from "../Spinner";

export const CellUserName = ({ name, userId, refetchUsersData }) => {
  const [orgState] = useOrgState();
  const [userState] = useUserState();
  const [showSave, setShowSave] = useState(false);
  const [userName, setUserName] = useState(name);
  const updateUser = useMutation((values) => putUserById(values));

  useEffect(() => {
    name !== userName ? setShowSave(true) : setShowSave(false);
  }, [name, userName]);

  if (updateUser.isLoading) {
    return <Spinner />;
  }

  const handleNameChange = (value) => {
    setUserName(value);
  };

  const handleOnSave = () => {
    updateUser.mutate(
      { orgId: orgState.id, userId, userName },
      {
        onSuccess: () => {
          refetchUsersData();
          setShowSave(false);
        },
      }
    );
  };

  return (
    <>
      <div className="name-cell-container">
        <Typography.Paragraph
          editable={
            userState.isAdmin
              ? {
                  onChange: handleNameChange,
                }
              : false
          }
        >
          {userName}
        </Typography.Paragraph>
        {showSave && (
          <Button onClick={handleOnSave} type="primary" size="small">
            Save
          </Button>
        )}
      </div>
    </>
  );
};
