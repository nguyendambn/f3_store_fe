import { useEffect, useState } from "react";
import { introspect } from "../services/auth/auth.service";
import { useSelector } from "react-redux";

export const Introspect = () => {
    const cart = useSelector(state => state.cart);
    const [isValid, setIsValid] = useState(false);
    const token = localStorage.getItem("accessToken") || "accessToken";
    const fetchApi = async () => {
    
        const res = await introspect({token});
        if(res.status == 200){
            setIsValid(res.data.result.valid);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);


    return isValid;
};
