import { prefixUser } from "../../constants"
import { post } from "../../utils/request"

export const createChatRoom = async () => {
    const res = await post(`${prefixUser}/chat-rooms`);
    return res;
}