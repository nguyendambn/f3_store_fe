import { useEffect, useState } from "react";
import { getSizes } from "../services/common/common.service";


export const ListSize = () => {
    const [sizes, setSizes] = useState([]);

    const fetchSize = async () => {
        const res = await getSizes();
        if (res.status === 200) {
            setSizes(res.data.result);
        }else if (res.status === 403){
            setSizes(null);
        }
    };

    useEffect(() => {
        fetchSize();
    }, []);

    const reload = () => fetchSize();

    return { sizes, reload };
};
