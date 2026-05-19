import { prefixAdmin } from "../../constants";
import { post } from "../../utils/request";

export const getMessage = async (data) => {
    const res = await post(`${prefixAdmin}/chat-messages`, data);
    return res;
}