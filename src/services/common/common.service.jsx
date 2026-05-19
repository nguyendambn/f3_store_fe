import { get,del } from "../../utils/request"

export const getColors = async () => {
    const res = await get("api/common/colors");
    return res;
}

export const getSizes = async () => {
    const res = await get("api/common/sizes");
    return res;
}

export const getCategories = async () => {
    const res = await get("api/common/categories");
    
    return res;
}
export const deleteCategory = async (id) => {
    const res = await del(`api/admin/categories/${id}`);    
    return res;
}
