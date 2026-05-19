import { DollarSign, MapPin, Package } from 'lucide-react';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { cancelOrder, listOrder } from '../../../services/Client/order.service';
import Swal from 'sweetalert2';
import FeedbackModal from '../feedback/modal.feedback';
import { ToastContainer } from 'react-toastify';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [addressData, setAddressData] = useState([]);
    console.log(orders);
    const fetchApi = async () => {
        const res = await listOrder();
        if (res.status === 200) {
            setOrders(res.data.result);
            setSelectedOrder(res.data.result[0]);
        }
    };
    useEffect(() => {
        fetchApi();
    }, []);

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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Đang giao':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Hoàn thành':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Đã hủy':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleCancleOrder = async () => {
        Swal.fire({
            title: "Bạn có chắc chắn?",
            text: "Hủy đơn hàng",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Chấp nhận",
            cancelButtonText: "Hủy bỏ"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await cancelOrder(selectedOrder.id);
                if (res.status == 200) {
                    fetchApi();
                    Swal.fire({
                        title: "Thành công!",
                        text: "Đơn hàng đã được hủy",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire({
                        title: "Lỗi",
                        text: "Đã có lỗi xảy ra vui lòng thử lại!",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                }
            }
        });
    }

    return (
        <>
            <ToastContainer position="top-center" autoClose={2000} pauseOnHover={false} />
            <div className="p-7">
                <div className="w-full mx-auto">
                    <div className="flex flex-col lg:flex-row gap-5 h-[80vh]">
                        {/* Danh sách đơn hàng */}
                        <div className="lg:w-1/3 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
                                <h2 className="text-xl font-semibold text-white flex items-center">
                                    <Package className="mr-2" size={24} />
                                    Danh sách đơn hàng
                                </h2>
                            </div>
                            <div className="flex-1 overflow-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng giá</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr
                                                key={order.id}
                                                onClick={() => setSelectedOrder(order)}
                                                className={`cursor-pointer transition duration-200 ease-in-out ${selectedOrder?.id === order.id
                                                    ? 'bg-blue-100 border-l-4 border-blue-500 font-semibold text-blue-900 shadow-sm'
                                                    : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">{moment(order.time).format("DD/MM/YYYY")}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-900">{formatCurrency(order.total)}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Chi tiết đơn hàng */}
                        <div className="lg:w-2/3 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-500 to-teal-600 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-white">
                                    Chi tiết đơn hàng #{selectedOrder?.id || ""}
                                </h2>
                                {
                                    selectedOrder?.status == "Chờ xác nhận" && (
                                        <button button
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={handleCancleOrder}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Hủy đơn hàng
                                        </button>
                                    )
                                }
                            </div>
                            {selectedOrder && (
                                <>
                                    {/* Địa chỉ nhận hàng */}
                                    <div className="px-6 py-4 border-b bg-white z-10">
                                        <label className="text-sm font-medium text-gray-500 flex items-center mb-2">
                                            <MapPin className="mr-2" size={16} />
                                            Địa chỉ nhận hàng
                                        </label>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">
                                            {selectedOrder.address?.detail}, {getWardName(selectedOrder.address?.cityId, selectedOrder.address?.districtId, selectedOrder.address?.wardId)}, {getDistrictName(selectedOrder.address?.cityId, selectedOrder.address?.districtId)}, {getCityName(selectedOrder.address?.cityId)}
                                        </p>
                                    </div>

                                    {/* Phương thức thanh toán */}
                                    <div className="px-6 py-4 border-b bg-white z-10">
                                        <label className="text-sm font-medium text-gray-500 flex items-center mb-2">
                                            <DollarSign className="mr-2" size={16} />
                                            Phương thức thanh toán
                                        </label>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">
                                            {selectedOrder.payment.name}
                                        </p>
                                    </div>

                                    {/* Danh sách sản phẩm */}
                                    <div className="flex-1 overflow-auto p-6 space-y-4">
                                        {selectedOrder.productCartItems?.map((item, idx) => (
                                            <div key={idx} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.image.src}
                                                        alt={item.name}
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-lg font-medium text-gray-900 mb-2">{item.name}</h4>
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                                                        <div className="flex items-center space-x-2">
                                                            <span>Màu sắc:</span>
                                                            <div className="flex items-center space-x-1">
                                                                <div
                                                                    className="w-4 h-4 rounded-full border border-gray-300"
                                                                    style={{ backgroundColor: item.color.hex }}
                                                                ></div>
                                                                <span>{item.color.name}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span>Kích thước: </span>
                                                            <span className="font-medium">{item.size.name}</span>
                                                        </div>
                                                        <div>
                                                            <span>Số lượng: </span>
                                                            <span className="font-medium">{item.quantity}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center flex-col-reverse gap-2">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        {formatCurrency(item.price)}
                                                    </span>
                                                    {selectedOrder?.status == "Hoàn thành" && (
                                                        <FeedbackModal product={item} />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div >

        </>
    );
};
export default Order;
