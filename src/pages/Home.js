import "../styles/Home.css";
import React, { useEffect } from "react";
import { Login } from "../components/Home/Login";
import { OrganizationForm } from "../components/Home/OrganizationForm";
import { useOrgState } from "../store/orgState";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { getOrganization } from "../apis/organizationApi";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../components/Spinner";

export const Home = () => {
  const [orgState, setOrgState] = useOrgState();
  const getOrgKey = [`get-org`];
  const navigate = useNavigate();
  const getOrg = useQuery(getOrgKey, getOrganization);

  useEffect(() => {
    if (getOrg.isSuccess && getOrg.data?.organization) {
      setOrgState(getOrg.data.organization);
    } else {
      setOrgState(null);
    }
  }, [getOrg.isSuccess, getOrg.data, setOrgState]);

  useEffect(() => {
    if (orgState) {
      navigate("/tickets");
    }
  }, [navigate, orgState]);

  if (getOrg.isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="home-content">
        {auth.currentUser ? !orgState?.id && <OrganizationForm /> : <Login />}
      </div>
    </>
  );
};
