import { get, patch, post,del } from "../../utils/request"
import { prefixAdmin } from "../../constants";

export const createCategory = async (data) => {
    const res = await post(`${prefixAdmin}/categories`, data);
    return res;
}

export const getCategoryById = async (id) => {
    const res = await get(`${prefixAdmin}/categories/${id}`);
    return res;
}

export const updateCategory = async (id, data) => {
    const res = await patch(`${prefixAdmin}/categories/${id}`, data);
    return res;
}
export const deleteCategory = async (id) => {
    const res = await del(`api/common/categories/${id}`);    
    return res;
}