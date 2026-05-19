import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// Bỏ getCategoryById vì dữ liệu đã có trong props
import { updateCategory } from "../../../services/admin/category.service";
import { notification } from "../../../helpers/toast";

// Nhận categoryToEdit (đối tượng danh mục), reload và onClose (hàm đóng modal)
function UpdateCategory({ categoryToEdit, reload, onClose }) {
    // categoryName được khởi tạo bằng tên danh mục hiện tại
    const [categoryName, setCategoryName] = useState(categoryToEdit.name);
    
    // Đảm bảo tên danh mục được cập nhật khi categoryToEdit thay đổi (dù trong ListCategory
    // đã đảm bảo categoryToEdit không đổi khi modal mở, nhưng đây là best practice)
    useEffect(() => {
        setCategoryName(categoryToEdit.name);
    }, [categoryToEdit.name]);

    const handleUpdate = async () => {
        if (categoryName.trim() === "") {
            notification(toast, "Tên danh mục không được để trống");
            return;
        }

        try {
            // Lấy ID từ đối tượng categoryToEdit
            const idToUpdate = categoryToEdit.id;

            const res = await updateCategory(idToUpdate, { name: categoryName });
            
            if (res.status === 200) {
                notification(toast, "Cập nhật danh mục thành công", "success");
                onClose(); // Sử dụng hàm đóng modal từ component cha
                reload();
            } else if (res.status === 403) {
                notification(toast, "Không có quyền thực hiện chức năng này");
            } else {
                 // Xử lý các lỗi HTTP khác (ví dụ: 400, 500)
                notification(toast, `Lỗi cập nhật: ${res.data.message || 'Lỗi không xác định'}`, "error");
            }
        } catch (err) {
            notification(toast, "Lỗi khi cập nhật danh mục", "error");
        }
    };

    return (
        // Modal UI
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
                <h3 className="text-xl font-semibold text-teal-600 mb-4 text-center">
                    Cập nhật danh mục
                </h3>
                {/* Có thể thêm thông tin danh mục cha nếu cần */}
                <p className="text-sm text-gray-500 mb-4">
                    Danh mục đang sửa: **{categoryToEdit.name}**
                </p> 
                <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                    placeholder="Tên danh mục mới"
                />
                <div className="mt-6 flex justify-between gap-4">
                    <button
                        onClick={handleUpdate}
                        className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                    >
                        Cập nhật
                    </button>
                    <button
                        onClick={onClose} // Sử dụng prop onClose
                        className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                    >
                        Huỷ
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateCategory;