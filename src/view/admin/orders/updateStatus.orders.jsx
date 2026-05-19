import { useState } from "react";
import { toast } from "react-toastify";
import { notification } from "../../../helpers/toast";
import { updateOrderStatus } from "../../../services/admin/order.service";

const UpdateStatus = ({ order, onClose, reload }) => {
  const [status, setStatus] = useState(order.status || "");

  const handleUpdate = async () => {
  if (!status) {
    notification(toast, "Vui lòng chọn trạng thái!");
    return;
  }

  try {
    await updateOrderStatus(order.id, status);
    notification(toast, "Cập nhật trạng thái thành công!", "success");
    reload();
    onClose();
  } catch (error) {
    notification(toast, "Cập nhật trạng thái thất bại");
  }
};


  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Trạng thái đơn hàng</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        >
          <option value="">-- Chọn trạng thái --</option>
          <option value="Đang giao">Đang giao</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2">
        <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">
          Hủy
        </button>
        <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">
          Cập nhật
        </button>
      </div>
    </div>
  );
};

export default UpdateStatus;
