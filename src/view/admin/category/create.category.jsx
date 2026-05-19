import { useState } from "react";
import { toast } from "react-toastify";
import { notification } from "../../../helpers/toast";
import { createCategory } from "../../../services/admin/category.service";

function CreateCategory({ categoryId, reload, onClose, parentCategoryName }) {
    const [categoryName, setCategoryName] = useState("");

    const handleSave = async () => {
        if (categoryName.trim() === "") {
            notification(toast, "Vui lòng nhập tên danh mục!");
        } else {
            const res = await createCategory({ parentId: categoryId, name: categoryName });
            if (res.status == 200) {
                setCategoryName("");
                onClose();
                reload();
                notification(toast, res.data.message, "success");
            } else if (res.status == 403) {
                notification(toast, "Không có quyền thực hiện chức năng này");
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 transition-all">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 transform transition-all duration-300 scale-95 hover:scale-100">
                <h3 className="text-2xl font-semibold text-teal-600 mb-6 text-center">
                    Thêm danh mục {categoryId ? `con của ` : `cha`} <span className="text-teal-800 font-bold">{parentCategoryName}</span>
                </h3>

                <div className="mb-6">
                    <label htmlFor="categoryName" className="block text-sm text-gray-700 font-medium">Tên danh mục</label>
                    <input
                        id="categoryName"
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="mt-2 p-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200 shadow-sm"
                        placeholder="Nhập tên danh mục"
                    />
                </div>

                <div className="flex justify-between items-center space-x-4">
                    <button
                        onClick={handleSave}
                        className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-all duration-200 font-medium shadow-lg transform hover:scale-105"
                    >
                        Thêm
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium shadow-lg transform hover:scale-105"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateCategory;
