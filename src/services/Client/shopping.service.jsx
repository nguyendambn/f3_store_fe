import { del, get, patch, post } from "../../utils/request"
import { prefixUser } from "../../constants"

export const addToCart = async (data) => {
    const res = await post(`${prefixUser}/shopping-cart`, data);
    return res;
}

export const getCart = async() => {
    const res = await get(`${prefixUser}/shopping-cart`);
    return res;
}

export const updateCart = async (data) => {
    const res = await patch(`${prefixUser}/shopping-cart`, data);
    return res;
}

export const resetCart = async () => {
    const res = await del(`${prefixUser}/shopping-cart`);
    return res;
}
