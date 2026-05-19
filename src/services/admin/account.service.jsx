import { prefixAdmin } from "../../constants/index";
import { del, get, patch, post } from "../../utils/request";


export const listAccount = async (filter) => {
    const { searchKey, status, roleId, pageNumber } = filter; 
    const res = await get(`${prefixAdmin}/accounts?searchKey=${searchKey}&status=${status}&roleId=${roleId}&pageNumber=${pageNumber}`);
    return res;
}

export const createAccount = async (dataFrom) => {
    const res = await post(`${prefixAdmin}/accounts`, dataFrom);
    return res;
}

export const deleteAccount = async (id) => {
    const res = await del(`${prefixAdmin}/accounts/${id}`);
    return res;
}

export const updateAccount = async (id, data) => {
    const res = await patch(`${prefixAdmin}/accounts/${id}`, data);
    return res;
}