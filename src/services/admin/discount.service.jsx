import { del, get, patch, post } from "../../utils/request"
import { prefixAdmin } from "../../constants";

export const listDiscountByProductId = async (productId) => {
    const res = await get(`${prefixAdmin}/discounts/${productId}`);
    return res;
}

export const createDiscount = async (data) => {
    const res = await post(`${prefixAdmin}/discounts`, data);
    return res;
}

export const deleteDiscount = async (id) => {
    const res = await del(`${prefixAdmin}/discounts/${id}`);
    return res;
}