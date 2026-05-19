import { MapPin, Phone, Plus, QrCode, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { infor as prof } from "../../../components/action/index.action";
import { updateAddress } from '../../../services/Client/address.service';
import { createUrlPayment } from "../../../services/Client/payment.service";
import { getProfile } from "../../../services/auth/auth.service";
import AddressModal from './addAddress.payment';
import { notification } from "../../../helpers/toast";
import { toast, ToastContainer } from 'react-toastify';

const Payment = () => {
    const profile = useSelector(state => state.infor);
    const cart = useSelector(state => state.cart);
    const totalPrice = cart.reduce((total, item) => total + Math.round(item.price * (1 - item.percent / 100)) * item.quantity, 0);
    const dispatch = useDispatch();
    const [addressData, setAddressData] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState('NCB');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchAddressData = async () => {
            try {
                const res = await fetch("https://provinces.open-api.vn/api/?depth=3");
                const data = await res.json();
                setAddressData(data);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu địa phương:", err);
            }
        };
        fetchAddressData();
    }, []);

    const getCityName = (id) => {
        const city = addressData.find(item => item.code === id);
        return city?.name || "Không rõ";
    };

    const getDistrictName = (cityId, districtId) => {
        const city = addressData.find(item => item.code === cityId);
        const district = city?.districts.find(d => d.code === districtId);
        return district?.name || "Không rõ";
    };

    const getWardName = (cityId, districtId, wardId) => {
        const city = addressData.find(item => item.code === cityId);
        const district = city?.districts.find(d => d.code === districtId);
        const ward = district?.wards.find(w => w.code === wardId);
        return ward?.name || "Không rõ";
    };


    const paymentMethods = [
        {
            id: 'NCB',
            name: 'Ví điện tử',
            icon: Wallet,
            description: 'VnPay, ZaloPay, ShopeePay',
        },
        {
            id: 'COD',
            name: 'Thanh toán khi nhận hàng',
            icon: Phone,
            description: 'Trả tiền mặt khi nhận hàng',
        },
        {
            id: 'VNPAYQR',
            name: 'Quét mã QR',
            icon: QrCode,
            description: 'Thanh toán nhanh bằng mã QR',
        },
    ];

    const handlePayment = async () => {
        const defaultAddress = profile.addresses.find(address => address.isDefault);
        if(cart.length == 0){
            notification(toast, "Không thể đặt hàng khi giỏ hàng rỗng");
            return;
        }
        if (!defaultAddress) {
            notification(toast, "Vui lòng chọn địa chỉ giao hàng");
            return;
        }
        if (selectedPayment == "COD") {
            window.location.href = `/payments/callback?vnp_ResponseCode=00&vnp_BankCode=${selectedPayment}`
        } else {
            const res = await createUrlPayment({ amount: totalPrice, language: "vn", bankCode: selectedPayment });
            
            if (res.status === 200) {
                window.location.href = res.data.result;
            }
        }
    }

    const handleDefaultAddress = async (address) => {
        address.isDefault = true;
        const res = await updateAddress(address.addressId, address);
        if (res.status == 200) {
            const infor = await getProfile();
            if (infor.status == 200) {
                localStorage.setItem("profile", JSON.stringify(infor.data.result));
                dispatch(prof(infor.data.result));
            }
        }
    }

    return (
        <>
            <ToastContainer position="top-center" autoClose={2000} pauseOnHover={false} />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Thanh toán</h1>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* LEFT: Địa chỉ + Phương thức thanh toán */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Địa chỉ giao hàng */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                            Địa chỉ giao hàng
                                        </h2>
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Thêm địa chỉ
                                        </button>
                                    </div>

                                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                                        {profile.addresses.map((address, index) => (
                                            <div
                                                key={address.id}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all ${address.isDefault
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                onClick={() => handleDefaultAddress(address)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center mb-2">
                                                            <div className="flex items-center">
                                                                <div
                                                                    className={`w-4 h-4 rounded-full border-2 mr-3 ${address.isDefault
                                                                        ? 'border-blue-500 bg-blue-500'
                                                                        : 'border-gray-300'
                                                                        }`}
                                                                >
                                                                    {address.isDefault && (
                                                                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                                                    )}
                                                                </div>
                                                                <span className="font-medium text-gray-900">{profile.name}</span>
                                                                <span className="ml-2 text-gray-600">|</span>
                                                                <span className="ml-2 text-gray-600">{profile.phone || "123456789"}</span>
                                                            </div>
                                                            {address.isDefault && (
                                                                <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                                                    Mặc định
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-600 ml-7">{address.detail}, {getWardName(address.cityId, address.districtId, address.wardId)}, {getDistrictName(address.cityId, address.districtId)}, {getCityName(address.cityId)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>

                                {/* Phương thức thanh toán */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Phương thức thanh toán</h2>
                                    <div className="space-y-3">
                                        {paymentMethods.map((method) => {
                                            const Icon = method.icon;
                                            return (
                                                <div
                                                    key={method.id}
                                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPayment === method.id
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    onClick={() => setSelectedPayment(method.id)}
                                                >
                                                    <div className="flex items-center">
                                                        <div
                                                            className={`w-4 h-4 rounded-full border-2 mr-4 ${selectedPayment === method.id
                                                                ? 'border-green-500 bg-green-500'
                                                                : 'border-gray-300'
                                                                }`}
                                                        >
                                                            {selectedPayment === method.id && (
                                                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                                            )}
                                                        </div>
                                                        <Icon className="w-5 h-5 text-gray-600 mr-3" />
                                                        <div>
                                                            <p className="font-medium text-gray-900">{method.name}</p>
                                                            <p className="text-sm text-gray-500">{method.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: Thông tin đơn hàng */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-6 bg-gray-50 rounded-lg p-4 border">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đơn hàng</h2>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Tạm tính:</span>
                                        <span className="text-gray-900">{totalPrice.toLocaleString()}₫</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Phí vận chuyển:</span>
                                        <span className="text-gray-900">0₫</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Giảm giá:</span>
                                        <span className="text-green-600">-0₫</span>
                                    </div>
                                    <hr className="my-3" />
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Tổng cộng:</span>
                                        <span className="text-red-600">{totalPrice.toLocaleString()}₫</span>
                                    </div>
                                    <button
                                        onClick={handlePayment}
                                        className="mt-6 w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 font-semibold">
                                        Đặt hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddressModal showModal={showModal} setShowModal={setShowModal} />
        </>
    );
};

export default Payment;
