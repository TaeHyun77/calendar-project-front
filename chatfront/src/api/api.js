import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create();

api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 400 && !originalRequest._retry) {
      console.log("Access token이 만료되었습니다. 재발급 시도 중...");

      originalRequest._retry = true;

      try {
        const response = await axios.post(
          "/reissue",
          {},
          { withCredentials: true }
        );

        console.log(response);

        const newAccessToken = response.headers["Authorization"];

        Cookies.set("accessToken", newAccessToken, {
          secure: true,
        });

        console.log("Access token이 성공적으로 재발급되었습니다.");

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        console.error(
          "Refresh token이 만료되었거나 오류가 발생했습니다. 로그아웃 처리 필요."
        );

        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
