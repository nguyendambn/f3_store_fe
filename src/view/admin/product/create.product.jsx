import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import slugify from "slugify";
import ImageUploader from "../../../helpers/imageUploader";
import { notification } from "../../../helpers/toast";
import TreeCategory from "../../../helpers/treeCategory.admin";
import { ListCategory } from "../../../hooks/listCategory";
import { createProduct } from "../../../services/admin/product.service";
import { getColors, getSizes } from "../../../services/common/common.service";

function CreateProduct() {
    const [dataForm, setDataForm] = useState({});
    const [images, setImages] = useState([]);
    const [resetImages, setResetImages] = useState(false); // ✅ trigger để reset ImageUploader
    const [editorKey, setEditorKey] = useState(Date.now()); // ✅ key để reset Quill

    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [variants, setVariants] = useState([
        { colorId: "", sizeId: "", stock: 0 }
    ]);

    const { categories } = ListCategory();
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [colorRes, sizeRes] = await Promise.all([
                    getColors(),
                    getSizes()
                ]);
                setColors(colorRes.data.result);
                setSizes(sizeRes.data.result);
            } catch (err) {
                console.error("Lỗi khi load dữ liệu danh mục/biến thể", err);
            }
        };
        fetchAll();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataForm({ ...dataForm, [name]: value });
    };

    const handleDescriptionChange = (value) => {
        setDataForm({ ...dataForm, description: value });
    };

    const handleVariantChange = (index, field, value) => {
        const updated = [...variants];
        updated[index][field] = value;
        setVariants(updated);
    };

    const addVariant = () => {
        setVariants([...variants, { colorId: "", sizeId: "", stock: 0 }]);
    };

    const removeVariant = (index) => {
        const updated = [...variants];
        updated.splice(index, 1);
        setVariants(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!dataForm.name) {
            notification(toast, "Tên sản phẩm không được để trống.");
        }else if (!dataForm.price){
            notification(toast, "Giá không được để trống.");
        }else if (!dataForm.quantity){
            notification(toast, "Số lượng không được để trống.");
        }else if (!dataForm.categoryId){
            notification(toast, "Danh mục không được để trống.");
        }else if (!images || images.length === 0){
            notification(toast, "Vui lòng chọn ít nhất một ảnh.");
        }else if (!dataForm.description){
            notification(toast, "Mô tả sản phẩm không được để trống.");
        }else if (variants.some(v => !v.colorId || !v.sizeId || v.stock <= 0)){
            notification(toast,  "Mỗi biến thể cần có màu, size và tồn kho hợp lệ.");
        }else {

            const formData = new FormData();

            for (const key in dataForm) {
                formData.append(key, dataForm[key]);
            }

            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }

            const slug = slugify(dataForm.name || "", {
                lower: true,
                strict: true,
                locale: "vi"
            });
            formData.append("slug", slug);

            const filteredVariants = variants.filter(v => v.colorId && v.sizeId);
            formData.append("variants", JSON.stringify(filteredVariants));

            const res = await createProduct(formData);
            if (res.status === 200) {
                notification(toast, "Tạo sản phẩm thành công", "success");
                setDataForm({});
                setImages([]);
                setResetImages(prev => !prev); // ✅ đổi trigger để reset ảnh
                setVariants([{ colorId: "", sizeId: "", stock: 0 }]);
                setEditorKey(Date.now()); // ✅ reset ReactQuill
            } else if (res.status == 403) {
                notification(toast, "Không có quyền thực hiện chức năng này");
            }
        }
    };

    return (
        <>
            <ToastContainer position="top-center" autoClose={5000} pauseOnHover={false} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-10 px-6">
                <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
                    <h2 className="text-3xl font-bold text-center text-blue-700 mb-10 flex items-center justify-center gap-2">
                        🛍️ <span>Tạo Sản Phẩm Mới</span>
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="font-medium mb-1 text-gray-700">Tên sản phẩm</label>
                                <input
                                    name="name"
                                    type="text"
                                    value={dataForm.name || ""}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="font-medium mb-1 text-gray-700">Giá</label>
                                <input
                                    name="price"
                                    type="number"
                                    value={dataForm.price || ""}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="font-medium mb-1 text-gray-700">Tổng số lượng</label>
                                <input
                                    name="quantity"
                                    type="number"
                                    value={dataForm.quantity || ""}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="font-medium mb-1 text-gray-700">Danh mục</label>
                                <select
                                    name="categoryId"
                                    value={dataForm.categoryId || ""}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    <option value="">Chọn danh mục</option>
                                    <TreeCategory records={categories} parentId={0} />
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium mb-2 text-gray-700">📝 Mô tả sản phẩm chi tiết</label>
                            <div className="border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-300">
                                <ReactQuill
                                    key={editorKey}
                                    theme="snow"
                                    value={dataForm.description || ""}
                                    onChange={handleDescriptionChange}
                                    placeholder="Nhập mô tả sản phẩm..."
                                    style={{
                                        height: "250px",
                                        display: "flex",
                                        flexDirection: "column"
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <ImageUploader
                                onFilesSelected={(files) => setImages(files)}
                                resetTrigger={resetImages} // ✅ gửi trigger
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">🎨 Biến thể sản phẩm</h3>
                            <div className="space-y-4">
                                {variants.map((variant, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
                                    >
                                        <select
                                            value={variant.colorId}
                                            onChange={e => handleVariantChange(index, "colorId", e.target.value)}
                                            className="border rounded-xl p-2"
                                        >
                                            <option value="">Chọn màu</option>
                                            {colors.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>

                                        <select
                                            value={variant.sizeId}
                                            onChange={e => handleVariantChange(index, "sizeId", e.target.value)}
                                            className="border rounded-xl p-2"
                                        >
                                            <option value="">Chọn size</option>
                                            {sizes.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>

                                        <input
                                            type="number"
                                            placeholder="Tồn kho"
                                            value={variant.stock}
                                            onChange={e => handleVariantChange(index, "stock", e.target.value)}
                                            className="border rounded-xl p-2"
                                            min="0"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => removeVariant(index)}
                                            className="w-full text-red-600 hover:text-white hover:bg-red-500 transition rounded-xl border border-red-300 py-2"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
                                >
                                    + Thêm biến thể
                                </button>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full bg-blue-700 text-white text-lg font-semibold py-4 rounded-2xl hover:bg-blue-800 transition shadow-lg"
                            >
                                ✅ Thêm sản phẩm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CreateProduct;
