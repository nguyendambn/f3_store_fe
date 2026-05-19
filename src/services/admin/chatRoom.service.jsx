import { prefixAdmin } from "../../constants"
import { post, get } from "../../utils/request"

export const getChatRooms = async () => {
    const res = await get(`${prefixAdmin}/chat-rooms`);
    return res;
}