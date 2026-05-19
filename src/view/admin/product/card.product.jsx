import { Popconfirm } from "antd";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import slugify from "slugify";
import Swal from "sweetalert2";
import Forbidden403 from "../../../components/error/unauthorized.error.jsx";
import Pagination from "../../../components/pagination/index.pagination";
import TreeCategory from "../../../helpers/treeCategory.admin.jsx";
import { ListCategory } from "../../../hooks/listCategory.jsx";
import { listDiscountByProductId } from "../../../services/admin/discount.service.jsx";
import { deleteProduct, filterProduct } from "../../../services/admin/product.service.jsx";
import PromotionModal from "./discount.product.jsx";
import { notification } from "../../../helpers/toast.jsx";


const AdminProductTable = ({ onEdit }) => {
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limitProduct, setLimitProduct] = useState(1);
  const [filter, setFilter] = useState({
    searchKey: "",
    categoryId: "",
    status: "",
    pageNumber: currentPage
  });

  const { categories } = ListCategory();

  const handleViewPromotions = async (product) => {
    setSelectedProduct(product);
    const res = await listDiscountByProductId(product.id);
    if (res.status === 200) {
      setSelectedPromotions(res.data.result);
    }
    setShowModal(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setFilter((prev) => ({ ...prev, pageNumber: newPage }));
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    const updateFilter = {
      ...filter,
      [name]: value,
      pageNumber: 1
    };
    setCurrentPage(1);
    setFilter(updateFilter);
  };

  const fetchApi = async () => {
    const filterData = {
      ...filter,
      searchKey: slugify(filter.searchKey || "", {
        lower: true,
        strict: true,
        locale: "vi"
      })
    };

    const res = await filterProduct(filterData);
    if (res.status === 200) {
      setProducts(res.data.result.products);
      setTotalProducts(res.data.result.totalProducts);
      setLimitProduct(res.data.result.limitProduct);
    }
  };
  useEffect(() => {
    fetchApi();
  }, [filter]);

  const totalPages = limitProduct > 0 ? Math.ceil(totalProducts / limitProduct) : 1;

  const handleDelete = async (id) => {
    let isSuccess;
    const res = await deleteProduct(id);
    if (res.status === 200) {
      isSuccess = true;
      await fetchApi();
    } else if (res.status == 403) {
      isSuccess = false;
    }
    return isSuccess;
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} pauseOnHover={false} />
      {categories == null ? (
        <Forbidden403 />
      ) : (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          {/* Filter */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              name="searchKey"
              onChange={handleFilter}
              placeholder="🔍 Tìm kiếm sản phẩm..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <select
              onChange={handleFilter}
              name="categoryId"
              value={filter.categoryId}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">📂 Tất cả danh mục</option>
              <TreeCategory records={categories} parentId={filter.categoryId} />
            </select>
            <select
              onChange={handleFilter}
              name="status"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">⚙️ Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Dừng hoạt động</option>
            </select>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-auto max-h-[400px]">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-100 text-gray-600 text-sm sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left">Ảnh</th>
                  <th className="px-4 py-2 text-left">Tên</th>
                  <th className="px-4 py-2 text-left">Danh mục</th>
                  <th className="px-4 py-2 text-center">Giá</th>
                  <th className="px-4 py-2 text-center">Khuyến mãi</th>
                  <th className="px-4 py-2 text-center">Số lượng</th>
                  <th className="px-4 py-2 text-center">Trạng thái</th>
                  <th className="px-4 py-2 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">
                      Không có sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <img src={p.src[0]} alt={p.name} className="w-14 h-14 object-cover rounded-md" />
                      </td>
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3">{p.category?.name || "Chưa rõ"}</td>
                      <td className="px-4 py-3 text-center">{p.price.toLocaleString()}₫</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => handleViewPromotions(p)} className="text-blue-500 hover:underline text-sm">
                          Xem khuyến mại
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">{p.quantity}</td>
                      <td className="px-4 py-3 text-center">
                        {p.deleted ? (
                          <span className="text-red-500">Dừng hoạt động</span>
                        ) : (
                          <span className="text-green-600">Đang hoạt động</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center space-x-2">
                        <Link to={`/admin/products/${p.id}`}>
                          <button className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                            <Pencil size={16} />
                          </button>
                        </Link>
                        <button
                          onClick={() =>
                            Swal.fire({
                              title: "Bạn có chắc chắn?",
                              text: "Thay đổi trạng thái sản phẩm",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#d33",
                              cancelButtonColor: "#3085d6",
                              confirmButtonText: "Chấp nhận",
                              cancelButtonText: "Hủy bỏ"
                            }).then(async (result) => {
                              if (result.isConfirmed) {
                                const status = await handleDelete(p.id);
                                if (status) {
                                  Swal.fire({
                                    title: "Đã xoá!",
                                    text: "Thay đổi trạng thái thành công.",
                                    icon: "success",
                                    timer: 1500,
                                    showConfirmButton: false
                                  });
                                } else {
                                  Swal.fire({
                                    title: "Lỗi",
                                    text: "Không có quyền thực hiện chức năng này",
                                    icon: "error",
                                    timer: 1500,
                                    showConfirmButton: false
                                  });
                                }
                              }
                            })
                          }
                          className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {products.map((p) => (
              <div key={p.product_id} className="border rounded-xl shadow-md p-4 bg-white">
                <div className="flex flex-col items-center gap-3">
                  <img src={p.src[0]} alt={p.name} className="w-24 h-24 object-cover rounded-lg shadow-sm" />
                  <div className="flex gap-4">
                    <button
                      onClick={() => onEdit(p.product_id)}
                      className="flex items-center gap-1 bg-blue-500 text-white text-sm px-3 py-1.5 rounded-full shadow hover:bg-blue-600"
                    >
                      <Pencil size={16} />
                      <span>Sửa</span>
                    </button>
                    <Popconfirm
                      title="Bạn có chắc chắn muốn xoá sản phẩm này?"
                      onConfirm={() => handleDelete(p.id)}
                      okText="Xoá"
                      cancelText="Huỷ"
                    >
                      <button className="flex items-center gap-1 bg-red-500 text-white text-sm px-3 py-1.5 rounded-full shadow hover:bg-red-600">
                        <Trash2 size={16} />
                        <span>Xóa</span>
                      </button>
                    </Popconfirm>
                  </div>
                  <div className="w-full text-center mt-3">
                    <h3 className="text-base font-semibold text-gray-800">{p.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">{p.category?.name || "Không rõ danh mục"}</p>
                    <p className="text-sm text-gray-700">Số lượng: <strong>{p.quantity}</strong></p>
                    <p className="text-sm text-gray-700">
                      Trạng thái:{" "}
                      {p.deleted ? (
                        <span className="text-red-500 font-medium">Dừng hoạt động</span>
                      ) : (
                        <span className="text-green-600 font-medium">Đang hoạt động</span>
                      )}
                    </p>
                    <button
                      onClick={() => handleViewPromotions(p)}
                      className="mt-2 inline-block text-blue-500 text-sm underline hover:text-blue-600"
                    >
                      Xem khuyến mãi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}

          <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />

          {/* Modal */}
          {showModal && (
            <PromotionModal
              product={selectedProduct}
              promotions={selectedPromotions}
              onClose={() => setShowModal(false)}
              refreshPromotions={async () => {
                const res = await listDiscountByProductId(selectedProduct.id);
                if (res.status === 200) {
                  setSelectedPromotions(res.data.result);
                }else if(res.status === 403){
                  notification(toast, "Không có quyền thực hiện chức năng này");
                }
              }}
            />
          )}
        </div>
      )}
    </>
  );
};

export default AdminProductTable;
