import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ListCategory as ListCategories } from "../../../hooks/listCategory";
import CreateCategory from "./create.category";
import Forbidden403 from "../../../components/error/unauthorized.error";
import UpdateCategory from "./update.category";
// *** ĐÃ THÊM LẠI IMPORT CÁC SERVICE CẦN THIẾT CHO CHỨC NĂNG XÓA ***
import { deleteCategory } from "../../../services/admin/category.service";
import { notification } from "../../../helpers/toast"; 

function ListCategory() {
    // --- KHAI BÁO STATE ---
    const { categories, reload } = ListCategories();
    
    // State riêng cho Modal THÊM
    const [createModalInfo, setCreateModalInfo] = useState({
        isOpen: false,
        parentCategoryId: 0, 
        parentCategoryName: "(Gốc)",
    }); 
    
    // State riêng cho Modal SỬA
    const [updateModalInfo, setUpdateModalInfo] = useState({
        isOpen: false,
        categoryToEdit: null,
    });

    // State cho Modal XÓA
    const [deleteModalInfo, setDeleteModalInfo] = useState({
        isOpen: false,
        categoryToDelete: null,
    });

    const [expandedCategories, setExpandedCategories] = useState({});

    // --- HÀM ĐÓNG MODAL ---
    const handleCloseCreateModal = () => {
        setCreateModalInfo({
            isOpen: false,
            parentCategoryId: 0,
            parentCategoryName: "(Gốc)",
        });
    };
    
    const handleCloseUpdateModal = () => {
        setUpdateModalInfo({
            isOpen: false,
            categoryToEdit: null,
        });
    };

    // Hàm đóng Modal XÓA
    const handleCloseDeleteModal = () => {
        setDeleteModalInfo({
            isOpen: false,
            categoryToDelete: null,
        });
    };

    // --- HÀM MỞ MODAL ---
    const handleOpenRootModal = () => {
        setCreateModalInfo({
            isOpen: true,
            parentCategoryId: 0, 
            parentCategoryName: "(Gốc)",
        });
    };

    const handleAddChild = (parentCategory) => {
        setCreateModalInfo({
            isOpen: true,
            parentCategoryId: parentCategory.id, 
            parentCategoryName: parentCategory.name, 
        });
    };
    
    const handleEditCategory = (category) => {
        setUpdateModalInfo({
            isOpen: true,
            categoryToEdit: category,
        });
    };
    
    // Xử lý mở Modal XÓA
    const handleDeleteCategory = (category) => {
        setDeleteModalInfo({
            isOpen: true,
            categoryToDelete: category,
        });
    };
    

    // --- LOGIC BẢNG VÀ RENDER CON ---
    const handleToggleExpand = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const renderChildRows = (parentCategory) => {
        if (!expandedCategories[parentCategory.id] || !parentCategory.children || parentCategory.children.length === 0) {
            return null;
        }

        return parentCategory.children.map((childCategory) => (
            <tr key={childCategory.id} className="border-b bg-gray-50">
                <td className="px-4 py-2"></td> 
                <td className="px-4 py-2 font-medium pl-8" colSpan="3">
                    <span className="text-gray-600">-- {childCategory.name}</span>
                </td>
                
                <td className="px-4 py-2 text-center">
                    {/* Hiển thị trạng thái dựa trên trường 'deleted' */}
                    {childCategory.deleted ? "Dừng hoạt động" : "Hoạt động"}
                </td>

                <td className="px-4 py-2 flex gap-2">
                    <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleEditCategory(childCategory)} 
                    >
                        Sửa
                    </button>
                    <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDeleteCategory(childCategory)}
                    >
                        Xóa
                    </button>
                </td>
            </tr>
        ));
    };

    // ------------------------------------------------------------------
    // KHAI BÁO COMPONENT CONFIRMDELETEMODAL NỘI BỘ 
    // ------------------------------------------------------------------
    function ConfirmDeleteModal({ categoryToDelete, reload, onClose }) {
        
        const handleDelete = async () => {
            if (!categoryToDelete || !categoryToDelete.id) return;

            try {
                // *** GỌI API DELETE THẬT SỰ ***
                const res = await deleteCategory(categoryToDelete.id); 
                
                if (res.status === 200) { 
                    notification(toast, `Đã xóa danh mục: ${categoryToDelete.name}`, "success");
                    onClose(); 
                    reload();  
                } else if (res.status === 403) {
                    notification(toast, "Không có quyền thực hiện chức năng này", "warning");
                } else {
                    notification(toast, `Lỗi khi xóa: ${res.data.message || "Lỗi không xác định"}`, "error");
                }
            } catch (err) {
                notification(toast, "Lỗi kết nối khi xóa danh mục", "error");
            }
        };

        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm">
                    <h3 className="text-xl font-semibold text-red-600 mb-4">Xác nhận xóa</h3>
                    
                    <p className="text-gray-700 mb-6">
                        Bạn có chắc chắn muốn xóa danh mục: 
                        <strong className="text-red-700"> {categoryToDelete?.name}</strong>?
                        <br />
                        Hành động này không thể hoàn tác!
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleDelete} // Gọi API xóa
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                            Xóa vĩnh viễn
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    // ------------------------------------------------------------------


    return (
        <>
            <ToastContainer position="top-center" autoClose={5000} pauseOnHover={false} />
            {categories == null ? (
                <Forbidden403 />
            ) : (
                <div className="p-6 bg-white rounded shadow mx-auto border">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Danh mục sản phẩm</h2>
                        <button
                            onClick={handleOpenRootModal} 
                            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-all duration-200"
                        >
                            Thêm danh mục
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-t border-gray-200">
                            <thead className="bg-gray-100 text-sm">
                                <tr>
                                    <th className="px-4 py-2 font-medium">STT</th>
                                    <th className="px-4 py-2 font-medium">Tên danh mục</th>
                                    <th className="px-4 py-2 font-medium">Xem danh mục con</th>
                                    <th className="px-4 py-2 font-medium text-center">Trạng thái</th>
                                    <th className="px-4 py-2 font-medium">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {categories.map((category, index) => (
                                    <>
                                        {/* Hàng Danh mục Cha */}
                                        <tr key={category.id} className="border-b">
                                            <td className="px-4 py-2">{index + 1}</td>
                                            <td className="px-4 py-2 font-bold">{category.name}</td>
                                            <td className="px-4 py-2 text-center">
                                                {category.children && category.children.length > 0 && (
                                                    <button
                                                        className={`px-2 py-1 rounded transition-colors duration-200 ${expandedCategories[category.id] ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                                                        onClick={() => handleToggleExpand(category.id)}
                                                    >
                                                        {expandedCategories[category.id] ? "Thu gọn" : "Xem danh mục con"}
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                {/* Đã sửa: Sử dụng category.deleted */}
                                                {category.deleted ? "Dừng hoạt động" : "Hoạt động"}
                                            </td>

                                            <td className="px-4 py-2 flex gap-2">
                                                <button
                                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                                    onClick={() => handleAddChild(category)}
                                                >
                                                    Thêm
                                                </button>
                                                <button
                                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                                    onClick={() => handleEditCategory(category)} 
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                                    onClick={() => handleDeleteCategory(category)}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                        
                                        {/* Hiển thị các hàng danh mục con */}
                                        {renderChildRows(category)}
                                    </>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            )
            }

            {/* Modal THÊM danh mục */}
            {
                createModalInfo.isOpen && (
                    <CreateCategory
                        categoryId={createModalInfo.parentCategoryId} 
                        reload={reload}
                        onClose={handleCloseCreateModal}
                        parentCategoryName={createModalInfo.parentCategoryName} 
                    />
                )
            }
            
            {/* Modal SỬA danh mục */}
            {
                updateModalInfo.isOpen && updateModalInfo.categoryToEdit && (
                    <UpdateCategory
                        categoryToEdit={updateModalInfo.categoryToEdit} // Truyền đối tượng cần sửa
                        reload={reload}
                        onClose={handleCloseUpdateModal} // Truyền hàm đóng modal
                    />
                )
            }
            
            {/* Modal XÓA danh mục */}
            {
                deleteModalInfo.isOpen && deleteModalInfo.categoryToDelete && (
                    <ConfirmDeleteModal
                        categoryToDelete={deleteModalInfo.categoryToDelete} // Truyền đối tượng cần xóa
                        reload={reload}
                        onClose={handleCloseDeleteModal} // Truyền hàm đóng modal
                    />
                )
            }
        </>
    );
}

export default ListCategory;