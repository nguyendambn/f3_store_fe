import { patch, post } from "../../utils/request";
import { prefixUser } from "../../constants/index";

export const createAddress = async (data) => {
    const res = await post(`${prefixUser}/addresses`, data);
    return res;
}

export const updateAddress = async (id, data) => {
    const res = await patch(`${prefixUser}/addresses/${id}`, data);
    return res;
}