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

    // 쿠키의 access 토큰으로 판별
    const accessToken = Cookies.get("Authorization");
    console.log(accessToken);

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    try {
      const response = await auth.info();
      const data = response.data;

      if (data === "UNAUTHORIZED" || response.status === 401) {
        console.error(`accss 토큰이 만료되거나 잘못되었습니다.`);
        return;
      }

      loginSetting(data, accessToken);
      console.log("로그인 여부 : " + isLogin)
    } catch (error) {
      console.log(`Error: ${error}`);

      if (error.response && error.response.status) {
        console.log(`Status: ${error.response.status}`);
      }
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

  const kakaoLogout = async () => {
    const accessToken = Cookies.get("accessToken");

    try {
      const datas = await axios.post(
        'https://kapi.kakao.com/v1/user/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      Cookies.remove(accessToken)
      setIsLogin(false);
      navigate('/');
    } catch (error) {
      console.error('카카오 로그아웃 실패', error);
    }
  };
  
  useEffect(() => {
    logincheck();
  }, []);

  return (
    <LoginContext.Provider value={{ isLogin, userInfo, roles, logincheck, kakaoLogout }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
