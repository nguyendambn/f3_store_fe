import { get, patch, post } from "../../utils/request";

// src/services/order.service.js

  
 export const getAllOrders= async() =>{
  const getToken = () => localStorage.getItem("accessToken");

  const res = await get("api/admin/ordersAdmin", {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return res.data;
}


export const updateOrderStatus = async (id, status) => {
  const res = await patch(`api/admin/ordersAdmin/${id}/status`, { status });
  return res.data;
};