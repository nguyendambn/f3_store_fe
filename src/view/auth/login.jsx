import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEyeSlash, faHome, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { addToFavorite, login, withGoogleOrFacebook } from "../../services/Client/user.service";
import { notification } from "../../helpers/toast";
import { jwtDecode } from "jwt-decode";
import { getProfile } from "../../services/auth/auth.service";
import { useDispatch, useSelector } from "react-redux";
import { createCart, infor as profile } from "../../components/action/index.action";
import { addToCart, getCart } from "../../services/Client/shopping.service";
import { getFavorite } from "../../services/Client/user.service";
function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);
    const favorite = useSelector(state => state.favorite);

    const loginWithProvider = async (type) => {
        try {
            const res = await withGoogleOrFacebook(type);
            if (res.status === 200) {
                window.location.href = res.data.message;
            } else {
                notification(toast, res.data.message);
            }
        } catch (err) {
            notification(toast, "Có lỗi xảy ra khi đăng nhập với " + type);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email.trim() == "") {
            notification(toast, "Vui lòng nhập email!");
        } else if (password.trim() == "") {
            notification(toast, "Vui lòng nhập mật khẩu!");
        } else {
            const res = await login({ email, password });
            if (res.status === 200) {
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
                        if (res.status == 200) {
                            const getCartUser = await getCart();
                            if (getCartUser.status == 200) {
                                localStorage.setItem('cart', JSON.stringify(getCartUser.data.result));
                                dispatch(createCart(getCartUser.data.result));
                                navigate("/");
                            }
                        }
                        const res2 = await addToFavorite(favorite);
                        console.log("kkk: ", res2);
                        if (res2.status == 200) {
                            const getFavoriteUser = await getFavorite();
                            console.log("jj:", getFavoriteUser);
                            if (getFavoriteUser.status == 200) {
                                localStorage.setItem('favorite', JSON.stringify(getFavoriteUser.data.result));
                                dispatch(creatFavorite(getFavoriteUser.data.result));
                                navigate("/");
                            }
                        }
                    }
                    else navigate("/admin/dashboard");
                } else {
                    notification(toast, "Không lấy được thông tin người dùng");
                    navigate("/login");
                }
            } else {
                notification(toast, res.data.message);
            }
        }
    };

    return (
        <>
            <ToastContainer position="top-center" autoClose={5000} pauseOnHover={false} />
            <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] font-poppins text-white px-4">
                <div className="w-full max-w-sm p-8 bg-[rgba(0,0,0,0.6)] rounded-2xl backdrop-blur-md shadow-xl">

                    <h1 className="text-center text-3xl font-bold mb-6 text-green-400">Đăng nhập</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 relative">
                            <input
                                type="text"
                                placeholder="Email"
                                className="w-full p-3 pl-10 bg-[rgba(255,255,255,0.1)] rounded-full focus:outline-none placeholder:text-white"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <span className="absolute left-4 top-[50%] translate-y-[-50%]">
                                <FontAwesomeIcon icon={faUser} />
                            </span>
                        </div>
                        <div className="mb-4 relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mật khẩu"
                                className="w-full p-3 pl-10 pr-10 bg-[rgba(255,255,255,0.1)] rounded-full focus:outline-none placeholder:text-white"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span className="absolute left-4 top-[50%] translate-y-[-50%]">
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                            <span
                                className="absolute right-4 top-[50%] translate-y-[-50%] cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="text-green-400" />
                            </span>
                        </div>
                        <div className="flex items-center justify-between mb-4 text-sm">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Ghi nhớ đăng nhập
                            </label>
                            <Link to={"/forgot"} className="hover:underline text-green-400">Quên mật khẩu</Link>
                        </div>
                        <button
                            type="submit"
                            className="w-full p-3 bg-gradient-to-r from-[#a64bf4] to-[#d946ef] text-white rounded-full font-semibold shadow-md hover:opacity-90 transition-all"
                        >
                            Đăng nhập
                        </button>
                    </form>

                    <div className="flex justify-center items-center my-4">
                        <div className="border-t border-gray-500 w-1/4" />
                        <span className="mx-2 text-sm">hoặc</span>
                        <div className="border-t border-gray-500 w-1/4" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <button className="w-full p-3 bg-[#db4437] rounded-full font-semibold hover:opacity-90 transition-all" onClick={() => loginWithProvider("google")}>
                            Đăng nhập với Google
                        </button>
                        <button className="w-full p-3 bg-[#3b5998] rounded-full font-semibold hover:opacity-90 transition-all" onClick={() => loginWithProvider("facebook")}>
                            Đăng nhập với Facebook
                        </button>
                    </div>

                    <p className="text-center text-sm mt-6">
                        Bạn chưa đăng ký? <Link to={"/register"} className="text-green-400 hover:underline">Tạo tài khoản</Link>
                    </p>

                    <div className="mt-6 pt-4 border-t border-gray-700 flex justify-center">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-all duration-300 group"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform duration-300" />
                            <span className=" font-medium">Quay lại trang chủ</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;