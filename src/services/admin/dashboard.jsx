import { get,getBlob } from "../../utils/request";
export const thongkeProduct = async () =>{
    const res = await get("api/admin/product");
    return res;
}
export const thongkeOrder = async () =>{
    const res = await get("api/admin/orders");
    return res;
}
export const thongkeCustomers = async () =>{
    const res = await get("api/admin/user");
    return res;
}
export const thongkeRecent = async () =>{
    const res = await get("api/admin/recent");
    return res;
}
export const thongkeTopOrder = async () =>{
    const res = await get("api/admin/topOrder");
    return res;
}
export const thongkeTotalMonth = async () => {
    const res = await get("api/admin/total_month");
    return res;
};
export const xuatBaoCao = async () => {
    return await getBlob("api/admin/total_month/excel");
};
