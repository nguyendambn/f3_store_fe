import { get, post, patch } from "../../utils/request"

export const getInfor = async () => {
    const res = await get("api/client/users/myInfor");
    return res;
}

export const login = async (data) => {
    const res = await post("auth/login", data);
    return res;
}


export const sendEmail = async (data) => {
    const res = await post("auth/sendEmail", data);
    return res;
}

export const getCity = async () => {
    const res = await get("cities");
    return res;
}

export const register = async (data) => {
    const res = await post("auth/register", data);
    return res;
}

export const withGoogleOrFacebook = async (type) => {
    const res = await get(`auth/social-login?type=${type}`);
    return res;
}

export const sendCode = async (type, code) => {
    const res = await get(`auth/login/${type}?code=${code}`);
    return res;
}

export const logout = async () => {
    const res = await get(`auth/logout`);
    return res;
}
export const updateInfor = async (data) => {
    const res = await patch("auth/profile", data);
    return res;
}
export const convertImg = async (formData) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Chưa có token xác thực, vui lòng đăng nhập.");
  }

  const res = await fetch("http://localhost:8081/api/upload-avatar", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // credentials: "include", // nếu backend dùng cookie session
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Upload thất bại: ${res.status} - ${errorText}`);
  }

  return await res.json();
};
export const getFavorite = async () => {
    const res = await get("api/favorite");
    return res;
}
export const addToFavorite = async(data) =>{
    const res = await post("api/favorite",data);
    return res;
}
export const updateFavorite = async(data) =>{
    const res = await patch("api/favorite",data);
    return res;
}
export const checkFavoriteExist = async() =>{
    const res = await get("api/favorite/exists");
    return res;
}
export const OTPRequest = async (email) => {
    const res = await post("auth/forgot/OTPRequest", { email });
    return res;
    
}
export const checkOTP = async (email,otp) => {
    const res = await post("auth/forgot/checkOTP", { email,otp });
    return res;
    
}
export const resetPassword = async (email, newPassword) => {
    const res = await patch("auth/forgot/reset", { email, newPassword });
    return res;
}

