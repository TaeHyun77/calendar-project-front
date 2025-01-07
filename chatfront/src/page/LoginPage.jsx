import React from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const LoginPage = () => {
  const navigate = useNavigate();

  const onNaverLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/naver";
    navigate("/");
  };

  const onGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
    navigate("/");
  };

  const onKakaoLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
    navigate("/");
  };

  return (
    <>
      <Header />
      <div className="userInfoContainer">
        <p className="login-text">로그인</p>
        <div>
          <button onClick={onNaverLogin} className="NaverBtn">
            Naver 로그인
          </button>
        </div>
        <div>
          <button onClick={onGoogleLogin} className="GoogleBtn">
            Google 로그인
          </button>
        </div>
        <div>
          <button onClick={onKakaoLogin} className="KakaoBtn">
            Kakao 로그인
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
