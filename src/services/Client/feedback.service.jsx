import { prefixUser } from "../../constants"
import { post } from "../../utils/request";

export const createFeedback = async (data) => {
    const res = await post(`${prefixUser}/feedbacks`, data);
    return res;
}