import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../../services/Client/order.service";
import { createCart } from "../../../components/action/index.action";
import { useNavigate } from "react-router-dom";

function PaymentCallback() {
    const navigate = useNavigate();
    const profile = useSelector(state => state.infor);
    const cart = useSelector(state => state.cart);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchApi = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const vnpResponseCode = urlParams.get("vnp_ResponseCode");
            const vnpBankCode = urlParams.get("vnp_BankCode");
            let namePayment;
            if(vnpBankCode == "NCB"){
                namePayment = "Ví điện tử"
            }else if (vnpBankCode == "VNPAYQR"){
                namePayment = "Quét mã QR"
            }else {
                namePayment = "Thanh toán khi nhận hàng"
            }
            if (vnpResponseCode == "00") {
                const address = profile.addresses.find(item => item.isDefault);
                const payment = {
                    code: vnpBankCode,
                    name: namePayment
                };
                const res = await createOrder({ cart, payment, address });
                if(res.status == 200){
                    localStorage.setItem('cart', JSON.stringify([]));
                    dispatch(createCart([]));
                    navigate("/");
                }
            }
        }
        fetchApi();
    }, []);
    return null;
}

export default PaymentCallback;