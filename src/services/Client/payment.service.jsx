import { prefixUser } from "../../constants"
import { post } from "../../utils/request"
export const createUrlPayment = async (data) => {
    const res = await post(`${prefixUser}/payments`, data);
    return res;
}