import React, { useState } from "react";
import { createDiscount, deleteDiscount } from "../../../services/admin/discount.service";
import moment from "moment/moment";
import { toast } from "react-toastify";
import { notification } from "../../../helpers/toast";
import { Trash2 } from "lucide-react";
import { Popconfirm } from "antd";

const PromotionModal = ({ product, promotions, onClose, refreshPromotions }) => {
  const [newPromo, setNewPromo] = useState({
    productId: product.id,
    percent: "",
    start_date: "",
    end_date: "",
  });

  const handleChange = (e) => {
    setNewPromo({ ...newPromo, [e.target.name]: e.target.value });
  };

  const handleAddPromotion = async () => {
    const start = moment(newPromo.start_date);
    const end = moment(newPromo.end_date);
    if (!newPromo.percent || !newPromo.start_date || !newPromo.end_date) {
      notification(toast, "Dữ liệu không hợp lệ");
    } else if (end.isBefore(start)) {
      notification(toast, "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu");
    } else {
      const res = await createDiscount(newPromo);
      if (res.status === 200) {
        setNewPromo({ ...newPromo, percent: "", start_date: "", end_date: "" });
        await refreshPromotions();
      } else if (res.status === 403) {
        notification(toast, "Không có quyền thực hiện chức năng này");
      } else {
        notification(toast, "Đã có lỗi xảy ra khi tạo khuyến mãi");
      }
    }
  };

  const handleDeletePromotion = async (id) => {
    const res = await deleteDiscount(id);
    if (res.status === 200) {
      toast.success("Xoá thành công");
      await refreshPromotions();
    } else {
      notification(toast, "Không thể xoá khuyến mãi");
    }

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-xl sm:max-h-[90vh] max-h-[95vh] overflow-y-auto rounded-xl shadow-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-lg font-bold"
        >
          ✕
        </button>

        {/* Content Padding */}
        <div className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
            Khuyến mãi của: <span className="text-blue-600">{product.name}</span>
          </h2>

          {/* Danh sách khuyến mãi */}
          <div className="mb-6 max-h-60 overflow-y-auto rounded-lg border">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-2 sm:p-3">Giảm (%)</th>
                  <th className="p-2 sm:p-3">Bắt đầu</th>
                  <th className="p-2 sm:p-3">Kết thúc</th>
                  <th className="p-2 sm:p-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {promotions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      Chưa có khuyến mãi nào
                    </td>
                  </tr>
                ) : (
                  promotions.map((promo, i) => (
                    <tr key={i} className="hover:bg-gray-50 border-t">
                      <td className="p-2 sm:p-3">{promo.percent}%</td>
                      <td className="p-2 sm:p-3">{moment(promo.startTime).format("DD/MM/YYYY")}</td>
                      <td className="p-2 sm:p-3">{moment(promo.endTime).format("DD/MM/YYYY")}</td>
                      <td className="p-2 sm:p-3">
                        <Popconfirm
                          title="Bạn có chắc chắn muốn xoá khuyến mãi này?"
                          onConfirm={() => handleDeletePromotion(promo.id)}
                          okText="Xoá"
                          cancelText="Huỷ"
                        >
                          <button
                            className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                          >
                            <Trash2 size={16} />
                            <span>Xoá</span>
                          </button>
                        </Popconfirm>

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Form thêm khuyến mãi */}
          <h3 className="font-semibold text-gray-700 mb-2">Thêm khuyến mãi</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <input
              type="number"
              name="percent"
              value={newPromo.percent}
              onChange={handleChange}
              placeholder="% giảm"
              className="border rounded px-2 py-2 text-sm w-full"
            />
            <input
              type="date"
              name="start_date"
              value={newPromo.start_date}
              onChange={handleChange}
              className="border rounded px-2 py-2 text-sm w-full"
            />
            <input
              type="date"
              name="end_date"
              value={newPromo.end_date}
              onChange={handleChange}
              className="border rounded px-2 py-2 text-sm w-full"
            />
          </div>
          <button
            onClick={handleAddPromotion}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm w-full sm:w-auto"
          >
            + Thêm khuyến mãi
          </button>
        </div>
      </div>
    </div>

  );
};

export default PromotionModal;
