import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { addToFavorite, getFavorite, sendCode } from "../../services/Client/user.service";
import { notification } from "../../helpers/toast";
import { jwtDecode } from "jwt-decode";
import { getProfile } from "../../services/auth/auth.service";
import { useDispatch, useSelector } from "react-redux";
import { infor as profile, createCart, creatFavorite } from "../../components/action/index.action";
import { addToCart, getCart } from "../../services/Client/shopping.service";

function OAuth2Callback() {
    const navigate = useNavigate();
    const { type } = useParams();
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);
    const favorite = useSelector(state => state.favorite);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        if (code) {
            const fetchApi = async () => {
                const res = await sendCode(type, code);
                if (res.status == 200) {
                    const token = res.data.result.token;
                    localStorage.setItem("accessToken", token);
                    const infor = await getProfile();
                    if (infor.status == 200) {
                        localStorage.setItem("profile", JSON.stringify(infor.data.result));
                        dispatch(profile(infor.data.result));
                        const scope = jwtDecode(token).scope;
                        const isUser = scope.split(" ").includes("ROLE_USER");
                        if (isUser) {
                            const res = await addToCart(cart);
                            if(res.status == 200){
                                const getCartUser = await getCart();
                                if(getCartUser.status == 200){
                                    localStorage.setItem('cart', JSON.stringify(getCartUser.data.result));
                                    dispatch(createCart(getCartUser.data.result));
                                    navigate("/");
                                }
                                
                            }
                            const res2 = await addToFavorite(favorite);
                            console.log("kkk: ",res2);
                            if(res2.status == 200){
                                const getFavoriteUser = await getFavorite();
                                console.log("j:",getFavoriteUser);
                                if(getFavoriteUser.status == 200){
                                    localStorage.setItem('favorite',JSON.stringify(getFavoriteUser.data.result));
                                    dispatch(creatFavorite(getFavoriteUser.data.result));
                                    navigate("/");
                                }
                            }
                        } else {
                            navigate("/admin/dashboard");
                        };
                    } else {
                        notification(toast, "Không lấy được thông tin người dùng");
                        navigate("/login");
                    }
                } else {
                    notification(toast, res.data.message);
                    navigate("/login");
                }
            }
            fetchApi();
        } else {
            toast.error("Thiếu mã code trong URL!");
            navigate("/login");
        }
    }, []);

    return <div className="text-white text-center mt-10">Đang xử lý đăng nhập Google...</div>;
}

export default OAuth2Callback;
