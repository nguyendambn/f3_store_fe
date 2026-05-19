import { prefixUser } from "../../constants"
import { del, get, post } from "../../utils/request"

export const createOrder = async (data) => {
    const res = await post(`${prefixUser}/orders`, data);
    return res;
}

export const listOrder = async () => {
    const res = await get(`${prefixUser}/orders`);
    return res;
} 

export const cancelOrder = async (id) => {
    const res = await del(`${prefixUser}/orders/${id}`);
    return res;
}