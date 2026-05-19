import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import slugify from "slugify";
import ImageUploader from "../../../helpers/imageUploader";
import { notification } from "../../../helpers/toast";
import TreeCategory from "../../../helpers/treeCategory.admin";
import { ListCategory } from "../../../hooks/listCategory";
import { getProductById, updateProduct } from "../../../services/admin/product.service";
import { getColors, getSizes } from "../../../services/common/common.service";
function UpdateProduct() {
    const { id } = useParams();
    const [dataForm, setDataForm] = useState({
        name: "",
        price: 0,
        quantity: 0,
        categoryId: "",
        description: "",
        src: []
    });
    const [images, setImages] = useState([]);
    const [imageUploaderKey, setImageUploaderKey] = useState(Date.now());
    const [initialImages, setInitialImages] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const { categories } = ListCategory();
    const [variants, setVariants] = useState([{ colorId: "", sizeId: "", stock: 0 }]);
    const [isLoading, setIsLoading] = useState(false);
    console.log(colors, sizes);
    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            try {
                const [colorRes, sizeRes, productRes] = await Promise.all([
                    getColors(),
                    getSizes(),
                    getProductById(id)
                ]);
                setColors(colorRes.data.result);
                setSizes(sizeRes.data.result);
                const product = productRes.data.result;
                setDataForm({
                    id: id,
                    name: product.name || "",
                    price: product.price || 0,
                    quantity: product.quantity || 0,
                    categoryId: product.category?.id || "",
                    description: product.description || "",
                    src: product.src || []
                });
                setVariants(product.variants || [{ colorId: "", sizeId: "", stock: 0 }]);
                const images = product.src || [];
                setInitialImages(images);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
                notification(toast, "Lỗi khi tải dữ liệu sản phẩm: " + err.message, "error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, [id]);

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
        const updated = variants.filter((_, i) => i !== index);
        setVariants(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!dataForm.name) {
            notification(toast, "Tên sản phẩm không được để trống.");
            return;
        }
        if (!dataForm.price || dataForm.price <= 0) {
            notification(toast, "Giá phải lớn hơn 0.");
            return;
        }
        if (!dataForm.quantity || dataForm.quantity < 0) {
            notification(toast, "Số lượng không được âm.");
            return;
        }
        if (!dataForm.categoryId) {
            notification(toast, "Danh mục không được để trống.");
            return;
        }
        const totalImages = [...initialImages, ...images];
        if (totalImages.length === 0) {
            notification(toast, "Vui lòng chọn ít nhất một ảnh.");
            return;
        }

        // if (images.length === 0) {
        //     notification(toast, "Vui lòng chọn ít nhất một ảnh.");
        //     return;
        // }
        if (!dataForm.description) {
            notification(toast, "Mô tả sản phẩm không được để trống.");
            return;
        }
        const filteredVariants = variants.filter(v => v.colorId && v.sizeId && v.stock > 0);
        if (filteredVariants.length === 0 && variants.length > 0) {
            notification(toast, "Vui lòng nhập ít nhất một biến thể hợp lệ hoặc xóa các biến thể trống.");
            return;
        }
        setIsLoading(true);
        const formData = new FormData();

        for (const key in dataForm) {
            if (key !== "src") {
                formData.append(key, dataForm[key]);
            }
        }
        for (const image of images) {
            if (image instanceof File) {
                formData.append("images", image);
            } else {
                console.warn("Đối tượng không phải File:", image);
            }
        }
        const slug = slugify(dataForm.name, { lower: true, strict: true, locale: "vi" });
        formData.append("slug", slug);
        formData.append("variants", JSON.stringify(filteredVariants));
        try {
            const res = await updateProduct(formData);
            if (res.status === 200) {
                notification(toast, "Cập nhật sản phẩm thành công", "success");
                setDataForm({
                    name: "",
                    price: 0,
                    quantity: 0,
                    categoryId: "",
                    description: "",
                    src: []
                });
                setImages([]);
                setVariants([{ colorId: "", sizeId: "", stock: 0 }]);
                setInitialImages([]);
                setImageUploaderKey(Date.now());
            } else if (res.status == 403) {
                notification(toast, "Không có quyền thực hiện chức năng này");
            }
        } catch (err) {
            notification(toast, "Lỗi khi cập nhật sản phẩm: " + err.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-center" autoClose={5000} pauseOnHover={false} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-10 px-6">
                <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
                    <h2 className="text-3xl font-bold text-center text-blue-700 mb-10 flex items-center justify-center gap-2">
                        🛍️ <span>Cập Nhật Sản Phẩm</span>
                    </h2>
                    {isLoading && <div className="text-center">Đang tải...</div>}
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="font-medium mb-1 text-gray-700">Tên sản phẩm</label>
                                <input
                                    name="name"
                                    type="text"
                                    onChange={handleChange}
                                    value={dataForm.name}
                                    className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    aria-label="Tên sản phẩm"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium mb-1 text-gray-700">Giá</label>
                                <input
                                    name="price"
                                    type="number"
                                    onChange={handleChange}
                                    value={dataForm.price}
                                    className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    min="0"
                                    aria-label="Giá sản phẩm"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium mb-1 text-gray-700">Tổng số lượng</label>
                                <input
                                    name="quantity"
                                    type="number"
                                    value={dataForm.quantity}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    min="0"
                                    aria-label="Số lượng sản phẩm"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium mb-1 text-gray-700">Danh mục</label>
                                <select
                                    name="categoryId"
                                    value={dataForm.categoryId}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    aria-label="Danh mục sản phẩm"
                                    disabled={isLoading}
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
                                    theme="snow"
                                    value={dataForm.description}
                                    onChange={handleDescriptionChange}
                                    placeholder="Nhập mô tả sản phẩm..."
                                    style={{
                                        height: "250px",
                                        display: "flex",
                                        flexDirection: "column"
                                    }}
                                    readOnly={isLoading}
                                />
                            </div>
                        </div>
                        <ImageUploader
                            key={imageUploaderKey}
                            onFilesSelected={(files) => setImages(files)}
                            initialImages={initialImages}
                        />
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
                                            aria-label="Màu sắc"
                                            disabled={isLoading}
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
                                            aria-label="Kích cỡ"
                                            disabled={isLoading}
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
                                            aria-label="Số lượng tồn kho"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(index)}
                                            className="w-full text-red-600 hover:text-white hover:bg-red-500 transition rounded-xl border border-red-300 py-2"
                                            aria-label="Xóa biến thể"
                                            disabled={isLoading}
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
                                    aria-label="Thêm biến thể"
                                    disabled={isLoading}
                                >
                                    + Thêm biến thể
                                </button>
                            </div>
                        </div>
                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full bg-blue-700 text-white text-lg font-semibold py-4 rounded-2xl hover:bg-blue-800 transition shadow-lg disabled:bg-gray-400"
                                disabled={isLoading}
                            >
                                {isLoading ? "Đang cập nhật..." : "✅ Cập nhật sản phẩm"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default UpdateProduct;