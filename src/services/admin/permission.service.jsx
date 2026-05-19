import { config } from "../../config/index.config"
import { get } from "../../utils/request";
import { prefixAdmin } from "../../constants";

export const listPermission = async () => {
    const res = await get(`${prefixAdmin}/permissions`);
    return res;
}