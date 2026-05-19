import { useEffect, useState } from "react";
import { filterProdutForUser } from "../services/Client/product.service";
import { useDispatch } from "react-redux";
import { productForUser } from "../components/action/index.action"
import slugify from "slugify";

export const findProductUser = ({ categoryId, searchKey }) => {
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchApi = async () => {
            const slugSearchKey = slugify(searchKey || "", {
                lower: true,
                strict: true,
                locale: "vi",
            });
            const res = await filterProdutForUser({ categoryId, slugSearchKey });
            if (res.status === 200) {
                setProducts(res.data.result);
                dispatch(productForUser(res.data.result));
            }
        };
        fetchApi();
    }, [categoryId, searchKey]);

    return products;
}