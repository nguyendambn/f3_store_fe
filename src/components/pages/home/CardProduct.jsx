import { Eye, Heart, RefreshCwIcon, ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCart, addFavorite } from "../../action/index.action";
import { notification } from "../../../helpers/toast";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { addToFavorite, checkFavoriteExist, updateFavorite } from "../../../services/Client/user.service";
import { useSelector } from "react-redux";

function CardProduct({ product }) {

    const [hoveredCard, setHoveredCard] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const products = useSelector(state => state.favorite);
    const profile = useSelector(state => state.infor);

    // Lấy danh sách size duy nhất từ details
    const sizes = [...new Set(product.details.map((detail) => detail.size.name))];

    // Lấy danh sách màu còn hàng (stock > 0)
    const colors = [
        ...new Map(
            product.details
                .filter((detail) => detail.stock > 0)
                .map((detail) => [
                    detail.color.id,
                    {
                        id: detail.color.id,
                        name: detail.color.name,
                        hex: detail.color.hexCode,
                    },
                ])
        ).values(),
    ];

    // Mặc định chọn màu đầu tiên nếu chưa chọn
    const defaultColor = colors[0] || null;

    // Mặc định chọn size đầu tiên nếu chưa chọn
    const defaultSize = sizes[0] || null;

    // Nếu chưa chọn thì set mặc định
    if (!selectedColor && defaultColor) setSelectedColor(defaultColor);
    if (!selectedSize && defaultSize) setSelectedSize(defaultSize);

    // Tìm detail tương ứng với màu và size đã chọn
    const selectedDetail = product.details.find(
        (detail) =>
            detail.color.id === selectedColor?.id && detail.size.name === selectedSize
    );

    // Lấy ảnh theo màu đã chọn
    const defaultImage = product.images.find(
        (img) => img.colorId === (selectedColor?.id || defaultColor?.id)
    );

    const currentImage = defaultImage || product.images[0];

    const discountPercent = product.discounts[0]?.percent || 0;
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            percent: discountPercent,
            image: {
                id: currentImage?.id,
                src: currentImage?.src
            },
            color: {
                id: selectedColor?.id,
                name: selectedColor?.name,
                hex: selectedColor?.hex
            },
            size: {
                id: selectedDetail?.size.id,
                name: selectedDetail?.size.name
            },
            stock: selectedDetail.stock,
            quantity: 1
        };
        if (cartItem.stock == 0) {
            notification(toast, "Sản phẩm này đã hết hàng!");
        } else {
            dispatch(addCart(cartItem));
            notification(toast, "Thêm sản phẩm thành công", "success");
        }
    }
    const handleAddFavorite = (productId) => async () => {
        console.log("profile:", profile);
        console.log("Thông tin product click: ", product);
        console.log("Slug cua sản phẩm:", product.slug);
        const favoriteItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            slug: product.slug,
            percent: discountPercent,
            image: {
                id: currentImage?.id,
                src: currentImage?.src
            },
            color: {
                id: selectedColor?.id,
                name: selectedColor?.name,
                hex: selectedColor?.hex
            },
            size: {
                id: selectedDetail?.size.id,
                name: selectedDetail?.size.name
            },
            stock: selectedDetail.stock,
            quantity: 1
        };

        dispatch(addFavorite(favoriteItem)); // Thêm vào redux

        try {

            setTimeout(async () => {
                const updatedFavorites = JSON.parse(localStorage.getItem('favorite')) || [];
                const res = await checkFavoriteExist();
                console.log("Kiem tra xem da ton tai chua:", res.data);
                if (res.data) {
                    await updateFavorite(updatedFavorites);

                } else {

                    await addToFavorite([favoriteItem]);

                }


                notification(toast, "Thêm sản phẩm yêu thích thành công", "success");
            }, 100);

        } catch (error) {
            console.error("Lỗi khi gửi lên backend:", error);
            notification(toast, "Lỗi khi lưu sản phẩm yêu thích", "error");
        }
    };




    return (
        <div
            key={product.id}
            className="relative border overflow-hidden rounded-lg group transform transition-all duration-300 hover:scale-[1.005] hover:shadow-[0_0_20px_rgba(0,0,0,0.1)]"
            onMouseEnter={() => setHoveredCard(product.id)}
            onMouseLeave={() => setHoveredCard(null)}
        >
            {/* SALE Badge */}
            {product.discounts.length > 0 && (
                <div className="absolute top-2 left-[-20px] z-10 rotate-[-45deg] bg-[#46C389] text-white text-xs font-bold px-6 py-[2px] shadow-md">
                    {product.discounts[0]?.percent}%
                </div>
            )}

            {/* Product Image */}
            <div className="relative h-64 w-full overflow-hidden">
                <img
                    src={currentImage.src || ""}
                    alt={product.name}
                    className="w-full h-full object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-110"
                />

                {/* Action Buttons */}
                <div className="absolute right-2 top-2 flex flex-col gap-2">
                    <button
                        onClick={handleAddFavorite(product.id)}
                        className={`p-2 bg-white rounded-full shadow-md transition-all duration-300 ${hoveredCard === product.id
                            ? "translate-x-0 opacity-100"
                            : "translate-x-12 opacity-0"
                            }`}
                    >
                        <Heart size={18} className="text-gray-600" />
                    </button>
                    <Link to={`/detail/${product.slug}`}>
                        <button

                            className={`p-2 bg-white rounded-full shadow-md transition-all duration-300 delay-75 ${hoveredCard === product.id
                                ? "translate-x-0 opacity-100"
                                : "translate-x-12 opacity-0"
                                }`}
                        >
                            <Eye size={18} className="text-gray-600" />
                        </button>
                    </Link>
                    <button
                        onClick={() => handleAddToCart(product.id)}
                        className={`p-2 bg-white rounded-full shadow-md transition-all duration-300 delay-150 ${hoveredCard === product.id
                            ? "translate-x-0 opacity-100"
                            : "translate-x-12 opacity-0"
                            }`}
                    >
                        <ShoppingCart size={18} className="text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Product Details */}
            <div className="p-4">
                <p className="text-rose-400 uppercase text-sm font-medium">
                    {product.category.name}
                </p>
                <h3 className="text-gray-600 font-medium mt-1">{product.name}</h3>

                {/* Color Selection */}
                <div className="flex items-center space-x-2 mt-3">
                    {colors.map((color) => (
                        <button
                            key={color.id}
                            onClick={() => setSelectedColor(color)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedColor?.id === color.id
                                ? "border-gray-600"
                                : "border-gray-300"
                                }`}
                            style={{ backgroundColor: color.hex }}
                        >
                            {selectedColor?.id === color.id && (
                                <Check size={12} className="text-white" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Size Selection */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-3 py-1 text-md border rounded-md ${selectedSize === size
                                ? "bg-black text-white border-black"
                                : "bg-white text-gray-700 border-gray-300"
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>

                {/* Hiển thị Stock và SoldCount cho màu & size đã chọn */}
                {selectedDetail ? (
                    <div className="mt-3 text-sm text-gray-700">
                        <div className="flex justify-between text-xs sm:text-sm">
                            <span className="font-medium text-gray-700">Đã bán: {selectedDetail.soldCount}</span>
                            <span className="font-medium text-gray-700">Còn lại:{selectedDetail.stock}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 sm:h-2">
                            <div
                                className="bg-pink-500 h-1 sm:h-2 rounded-full"
                                style={{ width: `${(selectedDetail.soldCount / (selectedDetail.soldCount + selectedDetail.stock)) * 100}%` }}
                            ></div>
                        </div>

                    </div>
                ) : (
                    <p className="mt-3 text-sm text-red-500">Không có sản phẩm với lựa chọn này</p>
                )}

                {/* Rating */}
                <div className="flex mt-3">
                    {[...Array(5)].map((_, index) => (
                        <svg
                            key={index}
                            className={`w-4 h-4 ${index < product.rating ? "text-orange-400" : "text-gray-300"
                                }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>

                {/* Price */}
                <div className="mt-2 text-base font-semibold">
                    {product.discounts.length > 0 ? (
                        <>
                            <span className="text-lg font-bold text-black">
                                {Math.round(product.price * (1 - discountPercent / 100)).toLocaleString()}₫
                            </span>
                            <span className="ml-2 text-sm text-gray-500 line-through">
                                {product.price.toLocaleString()}₫
                            </span>
                        </>
                    ) : (
                        <span className="text-lg font-bold text-black">
                            {product.price.toLocaleString()}₫
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CardProduct;
