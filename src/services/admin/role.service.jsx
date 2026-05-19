import { prefixAdmin } from "../../constants";
import { del, get, patch, post } from "../../utils/request";

export const listRole = async () => {
    const res = await get(`${prefixAdmin}/roles`);
    return res;
}

export const updatePermission = async (data) => {
    const res = await patch (`${prefixAdmin}/permissions`, data);
    return res;
}

export const createRole = async (data) => {
    const res = await post(`${prefixAdmin}/roles`, data);
    return res;
}

export const updateRole = async (id, data) => {
    const res = await patch(`${prefixAdmin}/roles/${id}`, data );
    return res;
}

export const deleteRole = async (id) => {
    const res = await del(`${prefixAdmin}/roles/${id}`);
    return res;
}