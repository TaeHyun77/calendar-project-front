import React, { useContext, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import "./Header.css";
import { LoginContext } from "../state/LoginProvider";

const Header = () => {
  const { isLogin, userInfo, kakaoLogout } = useContext(LoginContext);
  const navigate = useNavigate();

  const LoginPageClick = () => {
    navigate(`/LoginPage`);
  };

  const handleLogout = () => {
    kakaoLogout();
  };

  return (
    <header>
      <div className="logo">
        <Link to="/">
          <span className="logo-text">My캘린더</span>
        </Link>
      </div>

      {!isLogin ? (
      <div className="login-container" onClick={LoginPageClick}>
        <FaRegUser className="menu-icon" />
        <span className="header-login-text">로그인</span>
      </div>
      ) : (
        <div className="login-container" onClick={LoginPageClick}>
        <FaRegUser className="menu-icon" />
        <span className="header-login-text" onClick={handleLogout}>로그아웃</span>
      </div>
      )
      }
    </header>
  );
};

export default Header;
