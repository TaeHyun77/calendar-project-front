import React, { useEffect, useState, createContext } from "react";
import api from "../api/api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as auth from "../api/auth";

export const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [roles, setRoles] = useState({ isUser: false, isAdmin: false });
  const [userInfo, setUserInfo] = useState({});

  const navigate = useNavigate();

  const logincheck = async () => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      console.log(`Access Token: ${accessToken}`);

      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      try {
        const response = await auth.info();
        const data = response.data;
        console.log(`data : ${data}`);

        if (data === "UNAUTHORIZED" || response.status === 401) {
          console.error("Access 토큰이 만료되거나 잘못되었습니다.");
          return;
        }

        loginSetting(data, accessToken);
        console.log("로그인 여부 : " + isLogin);
      } catch (error) {
        console.error(`Error: ${error}`);
        if (error.response && error.response.status) {
          console.error(`Status: ${error.response.status}`);
        }
      }
    } else {
      console.warn("Access Token이 없습니다.");
    }
  };

  const loginSetting = (userData, accessToken) => {
    const { username, role, name, email } = userData;

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    setIsLogin(true);

    setUserInfo({ username, role, name, email });

    const updatedRoles = {
      isUser: role === "ROLE_USER",
      isAdmin: role === "ROLE_ADMIN",
    };

    setRoles(updatedRoles);
  };

  useEffect(() => {
    logincheck();
  }, []);

  return (
    <LoginContext.Provider
      value={{ isLogin, setIsLogin, userInfo, roles, logincheck }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
