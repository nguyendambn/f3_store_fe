import { useState } from "react";
import { X } from "lucide-react";
import { useListOrdersAdmin } from "../../../hooks/listOrder";
import { fullTime } from "../../../helpers/convertTime";
import UpdateStatus from "./updateStatus.orders";
import { ToastContainer } from "react-toastify";

const OrdersAdmin = () => {
  const { orders, loading, reload } = useListOrdersAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (loading) return <p>Đang tải đơn hàng...</p>;

  return (
    <div className="p-6 bg-white rounded shadow border">
      <ToastContainer position="top-center" autoClose={4000} />
      <h2 className="text-xl font-semibold mb-4">Danh sách đơn hàng</h2>
      <table className="w-full text-left border-t border-gray-200">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="px-4 py-2 font-medium">Mã ĐH</th>
            <th className="px-4 py-2 font-medium">Khách hàng</th>
            <th className="px-4 py-2 font-medium">Ngày đặt</th>
            <th className="px-4 py-2 font-medium">Phương thức thanh toán</th>
            <th className="px-4 py-2 font-medium">Trạng thái</th>
            <th className="px-4 py-2 font-medium text-right">Tổng tiền</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {orders.map((order) => (
            <tr key={order.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{order.id}</td>
              <td className="px-4 py-2">{order.username}</td>
              <td className="px-4 py-2">{fullTime(order.time)}</td>
              <td className="px-4 py-2">{order.payment}</td>
              <td className="px-4 py-2">
                <span className="block">{order.status}</span>
                {
                  (order?.status != "Đã hủy" && order?.status != "Hoàn thành" ) && (
                    <button
                      onClick={() => openStatusModal(order)}
                      className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded shadow transition-all duration-200"
                    >
                      Cập nhật
                    </button>
                  )
                }

              </td>
              <td className="px-4 py-2 text-right">
                {order.total.toLocaleString()}₫
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal cập nhật trạng thái */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-96 p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-semibold mb-4">Cập nhật trạng thái đơn hàng</h3>
            <UpdateStatus
              order={selectedOrder}
              onClose={() => setIsModalOpen(false)}
              reload={reload}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;
