import { verifyToken as verify, get, post } from "../../utils/request";
    
export const verifyToken = async (data) => {
    const res = await verify("auth/introspect", data);
    return res;   
}

export const getProfile = async () =>{
    const res = await get("auth/profile");
    console.log("getProfile", res);
    return res;
}

export const introspect = async (data) => {
    const res = await post("auth/introspect", data);
    return res;
}