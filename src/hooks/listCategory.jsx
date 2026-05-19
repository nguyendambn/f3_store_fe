import { useEffect, useState } from "react";

import { getCategories } from "../services/common/common.service";

export const ListCategory = () => {
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        const res = await getCategories();
        console.log(res);
        if (res.status === 200) {
            setCategories(res.data.result);
        }else if (res.status === 403){
            setCategories(null);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const reload = () => fetchCategories();

    return { categories, reload };
};
