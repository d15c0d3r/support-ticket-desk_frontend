import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { useOrgState } from "../store/orgState";

export const AuthGuard = ({ children }) => {
  const [orgState] = useOrgState();

  if (!(orgState && auth.currentUser)) {
    return <Navigate to="/" />;
  }
  return children;
};
