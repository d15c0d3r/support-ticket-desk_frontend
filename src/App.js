import "antd/dist/antd.min.css";
import "./styles/App.css";
import axios from "axios";
import { React, useEffect, useState } from "react";
import { Button, Layout, Menu, Typography, notification } from "antd";
import { AllRoutes } from "./components/AllRoutes";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { auth } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useOrgState } from "./store/orgState";
import { useUserState } from "./store/userState";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserByEmail } from "./apis/userApi";
import { signOut } from "firebase/auth";
import { Spinner } from "./components/Spinner";

const { Header, Content, Footer, Sider } = Layout;

axios.interceptors.request.use(async (config) => {
  try {
    const tokenResult = await auth.currentUser?.getIdTokenResult(false);
    if (tokenResult) {
      config.headers["Authorization"] = `Bearer ${tokenResult.token}`;
    }
    return config;
  } catch (err) {
    console.log(err);
  }
});

const App = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [orgState, setOrgState] = useOrgState();
  const [userState, setUserState] = useUserState();
  const [isUseEffectRunning, setIsUseEffectRunning] = useState(true);
  const [fetchingUserdata, setFetchingUserdata] = useState(true);
  const getUserkey = [`get-user`];
  const getUser = useQuery(getUserkey, getUserByEmail);

  useEffect(() => {
    const unlisten = onAuthStateChanged(auth, async (user) => {
      setIsUseEffectRunning(true);
      if (user && !userState?.id && getUser.data !== null) {
        localStorage.setItem("token", user.accessToken);
        await queryClient.refetchQueries(getUserkey);
        if (getUser.data && !getUser.data?.message && !getUser.data?.error) {
          setUserState(getUser.data);
        } else {
          setUserState(null);
        }
      }
      setIsUseEffectRunning(false);
    });
    return () => {
      unlisten();
    };
  }, [getUserkey, queryClient, setUserState, getUser.data, userState]);

  useEffect(() => {
    if (getUser.isLoading || isUseEffectRunning) {
      setFetchingUserdata(true);
    } else {
      setFetchingUserdata(false);
    }
  }, [getUser.isLoading, isUseEffectRunning]);

  const logoutHandler = () => {
    const openNotification = (description) => {
      notification.open({
        message: "Logout Status",
        description,
        duration: 2,
      });
    };
    signOut(auth)
      .then(() => {
        navigate("/");
        openNotification("Logged out Successfully!");
        setOrgState(null);
      })
      .catch((error) => {
        openNotification("Error while logging out");
      });
  };

  if (fetchingUserdata) {
    return <Spinner />;
  }

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          // console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          // console.log(collapsed, type);
        }}
        style={{ position: "fixed", minHeight: "100vh" }}
      >
        <div className="logo">Ticket Desk</div>
        <Menu theme="dark" mode="inline">
          {[
            ["/tickets", "Tickets"],
            ["/insights", "Insights"],
            ["/users", "Users"],
          ].map((navItem, idx) => (
            <Menu.Item key={idx}>
              <NavLink to={navItem[0]}>{navItem[1]}</NavLink>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: "200px" }}>
        <Header className="site-layout-sub-header-background">
          <Typography.Title level={1}>
            {location.pathname.split("/")[1].toUpperCase() ||
              (!(auth.currentUser || orgState) && "ONBOARD")}
          </Typography.Title>
          {auth.currentUser && (
            <Button className="btn" type="primary" onClick={logoutHandler}>
              Logout
            </Button>
          )}
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          <div
            className="site-layout-background"
            style={{
              padding: 24,
            }}
          >
            <AllRoutes fetchingData={fetchingUserdata} />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Support Ticket Desk © 2022 Created by Naga : BeautifulCode
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;
