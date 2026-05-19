import { Check, Minus, Plus, RefreshCcw, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { dateTime } from "../../../helpers/convertTime";
import { detailProduct } from "../../../services/Client/product.service";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import { notification } from "antd";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';


// import required modules
import { CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { addCart } from "../../../components/action/index.action";
import { ListSize } from "../../../hooks/listSize";


const ProductDetail = () => {
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { sizes: listSizes } = ListSize();
    const { slug } = useParams();
    const [item, setItem] = useState({});
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const sizes = [...new Set(item.details?.map((detail) => detail.size.name))];
    console.log(item);
    const colors = [
        ...new Map(
            item.details
                ?.filter((detail) => detail.stock > 0)
                ?.map((detail) => [
                    detail.color.id,
                    {
                        id: detail.color.id,
                        name: detail.color.name,
                        hex: detail.color.hexCode,
                    },
                ])
        ).values(),
    ];
    const handleAddToCart = (action) => {
        const currentImage = item.images?.find(ite => ite.colorId === getSelectedDetail().color.id);
        const cartItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            percent: item.discounts[0]?.percent || 0,
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
                id: getSelectedDetail().size.id,
                name: getSelectedDetail().size.name
            },
            stock: getSelectedDetail().stock,
            quantity: quantity
        };
        dispatch(addCart(cartItem));
        if (action === "buy") {
            if (localStorage.getItem("accessToken")) {
                navigate("/payment");
                return;
            }
            api.open({
                message: (
                    <div style={{ color: '#fff' }}>
                        Thông báo
                    </div>
                ),
                description: (
                    <div style={{ color: '#fff' }}>
                        Vui lòng đăng nhập để thực hiện chức năng này.
                    </div>
                ),
                icon: <ExclamationCircleOutlined style={{ color: '#fff', fontSize: 20 }} />,
                style: {
                    backgroundColor: '#ff4d4f', // đỏ tươi
                    borderRadius: 8,
                    padding: 16,
                },
                closeIcon: false,
                duration: 1.5,
                placement: 'topRight',
            });
        } else {
             api.open({
                message: (
                    <div style={{ color: '#fff' }}>
                        Thông báo
                    </div>
                ),
                description: (
                    <div style={{ color: '#fff' }}>
                        Thêm sản phẩm thành công.
                    </div>
                ),
                icon: <CheckCircleOutlined style={{ color: '#fff', fontSize: 20 }} />,
                style: {
                    backgroundColor: 'green', // đỏ tươi
                    borderRadius: 8,
                    padding: 16,
                },
                closeIcon: false,
                duration: 1.5,
                placement: 'topRight',
            });
        }
    }
    useEffect(() => {
        // Mặc định chọn màu đầu tiên nếu chưa chọn
        const defaultColor = colors[0] || null;

        // Mặc định chọn size đầu tiên nếu chưa chọn
        const defaultSize = sizes[0] || null;

        // Nếu chưa chọn thì set mặc định
        if (!selectedColor && defaultColor) setSelectedColor(defaultColor);
        if (!selectedSize && defaultSize) setSelectedSize(defaultSize);
    }, [item])

    const getSelectedDetail = () => {
        return item.details?.find(
            (detail) =>
                detail.color.id === selectedColor?.id &&
                detail.size.name === selectedSize
        );
    }

    const [mainSwiper, setMainSwiper] = useState(null); // lưu instance swiper chính

    // Khi selectedColor thay đổi => chuyển slide Swiper tương ứng
    useEffect(() => {
        if (!mainSwiper || !selectedColor || !item.images) return;

        // Tìm index ảnh đầu tiên có colorId = selectedColor.id
        const index = item.images.findIndex(img => img.colorId === selectedColor.id);

        if (index !== -1) {
            // Swiper trong loop mode: cần chú ý vì index nội bộ của Swiper có thể khác
            // Dùng slideToLoop để tự xử lý index với loop=true
            mainSwiper.slideToLoop(index);
        }
    }, [selectedColor, mainSwiper, item.images]);



    useEffect(() => {
        const fetchDetailProuct = async () => {
            const res = await detailProduct(slug);
            if (res.status === 200) {
                setItem(res.data.result);
            }
        }
        fetchDetailProuct();
    }, []);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [isFavorite, setIsFavorite] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    const features = [
        { icon: <Truck size={16} />, text: "Giao hàng miễn phí cho đơn hàng từ 300.000₫" },
        { icon: <ShieldCheck size={16} />, text: "Bảo hành chất lượng 30 ngày" },
        { icon: <RefreshCcw size={16} />, text: "Đổi trả trong vòng 7 ngày" }
    ];

    const decrementQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price) + "₫";
    };

    return (
        <>
            {contextHolder}
            <div className="max-w-7xl mx-auto p-4 font-sans">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left: Product Images */}
                    <div className="space-y-4">
                        <Swiper
                            style={{
                                '--swiper-navigation-color': '#fff',
                                '--swiper-pagination-color': '#fff',
                            }}
                            loop={true}
                            spaceBetween={10}
                            navigation={true}
                            thumbs={{ swiper: thumbsSwiper }}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="mySwiper2"
                            onSwiper={setMainSwiper}  // lưu instance swiper chính
                        >
                            {item.images?.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <img src={img.src} alt={`slide-${idx}`} />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <Swiper
                            onSwiper={setThumbsSwiper}
                            loop={true}
                            spaceBetween={10}
                            slidesPerView={4}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="mySwiper"
                        >
                            {item.images?.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <img src={img.src} alt={`thumb-${idx}`} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    {/* Right: Product Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                {item.name}
                            </h1>
                            <div className="flex items-center mt-2 space-x-4">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} size={18} className="text-yellow-400 fill-yellow-400" />
                                    ))}
                                    <span className="ml-2 text-sm text-gray-600">({item.feedbacks?.length || 0} đánh giá)</span>
                                </div>
                                <span className="text-sm text-gray-500">Số lượng: {item.quantity}</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline space-x-3">
                            {item.discounts?.length > 0 ? (
                                <>
                                    <span className="text-2xl font-bold text-red-600">{formatPrice(item.discounts?.length > 0 ? Math.round(item.price * (1 - item.discounts[0].percent / 100)) : 0)}</span>
                                    <span className="text-lg text-gray-500 line-through">{formatPrice(item.price)}</span>
                                    <span className="text-sm font-medium px-2 py-1 bg-red-100 text-red-600 rounded">{item.discounts?.length > 0 ? item.discounts[0].percent : 0}%</span>
                                </>
                            ) : (
                                <span className="text-2xl font-bold text-red-600">{formatPrice(item.price)}</span>
                            )}
                        </div>

                        {/* Features */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <ul className="space-y-2">
                                {features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-sm text-gray-700">
                                        <span className="mr-2 text-blue-600">{feature.icon}</span>
                                        {feature.text}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Size Options */}
                        <div className="flex items-center space-x-2 mt-3">
                            {colors.map((color, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${selectedColor === color ? "border-gray-600" : "border-gray-50"
                                        }`}
                                    style={{ backgroundColor: color.hex }}
                                >
                                    {selectedColor?.id === color?.id && <Check size={16} className="text-white" />}
                                </button>
                            ))}
                        </div>

                        {/* Size Selection */}
                        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex flex-wrap gap-3">
                                {sizes.map((size, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedSize(size)}
                                        className={`min-w-[48px] px-4 py-2 text-sm font-medium border rounded-lg transition-colors duration-200
                                        ${selectedSize === size
                                                ? "bg-black text-white border-black shadow-md"
                                                : "bg-white text-gray-700 border-gray-300 hover:border-black hover:text-black"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            <div
                                onClick={() => setShowGuide(!showGuide)}
                                className="text-sm text-blue-600 hover:cursor-pointer ml-1 sm:ml-4 whitespace-nowrap">
                                Tư vấn size
                            </div>
                        </div>


                        {/* Quantity */}
                        {
                            getSelectedDetail() ? (
                                <div className="mt-6">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-sm">
                                            <button
                                                onClick={decrementQuantity}
                                                className="px-3 py-2  text-gray-600 transition"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <input
                                                min="1"
                                                type="number"
                                                readOnly
                                                value={quantity}
                                                className="w-10 text-center py-2 bg-white text-gray-800 text-sm font-medium focus:outline-none"
                                            />
                                            <button
                                                onClick={() => quantity < getSelectedDetail().stock && setQuantity(quantity + 1)}
                                                className="px-3 py-2  text-gray-600 transition"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <span className="text-sm text-gray-500">
                                            Còn lại: <span className="font-semibold text-gray-700">{getSelectedDetail().stock}</span> sản phẩm
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-red-500 text-md">Không có sản phẩm với lựa chọn này</div>
                            )
                        }


                        {/* Total */}
                        <div className="py-3 border-t border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-medium text-gray-700">Tạm tính:</span>
                                <span className="text-xl font-bold text-red-600">{formatPrice(item.price * quantity)}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <button
                                onClick={() => handleAddToCart("buy")}
                                className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                                <ShoppingBag size={20} />
                                <span>Mua ngay</span>
                            </button>
                            <button
                                onClick={() => handleAddToCart("add")}
                                className="flex items-center justify-center space-x-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition-colors">
                                <Plus size={20} />
                                <span>Thêm vào giỏ</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Info Tabs */}
                <div className="mt-12">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8">
                            {[
                                { id: "description", label: "Mô tả sản phẩm" },
                                { id: "details", label: "Thông tin chi tiết" },
                                { id: "reviews", label: `Đánh giá (${item.feedbacks?.length || 0})` }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 text-sm font-medium border-b-2 ${activeTab === tab.id
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="py-6">
                        {activeTab === "description" && (
                            <div className="prose max-w-none">
                                <h3 className="text-lg font-semibold mb-3">{item.name}</h3>
                                <p>
                                    {item.description}
                                </p>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium mb-2">Ưu điểm nổi bật</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-sm">    
                                            <li>Kháng khuẩn, an toàn cho da</li>
                                            <li>Form dáng chuẩn châu Á</li>
                                            <li>Màu sắc bền đẹp, không xù lông</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium mb-2">Hướng dẫn bảo quản</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-sm">
                                            <li>Giặt máy ở nhiệt độ thường</li>
                                            <li>Không sử dụng chất tẩy</li>
                                            <li>Phơi trong bóng râm</li>
                                            <li>Là ủi ở nhiệt độ thấp</li>
                                            <li>Giặt riêng sản phẩm tối màu</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "details" && (
                            <div className="space-y-4">
                                <table className="min-w-full border border-gray-200">
                                    <tbody>
                                        <tr className="bg-gray-50">
                                            <td className="py-2 px-4 border-b font-medium w-1/3">Danh mục</td>
                                            <td className="py-2 px-4 border-b">{item.category.name}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="py-2 px-4 border-b font-medium">Xuất xứ</td>
                                            <td className="py-2 px-4 border-b">Việt Nam</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 px-4 border-b font-medium">Kiểu dáng</td>
                                            <td className="py-2 px-4 border-b">Đẹp, phong cách hiện đại phù hợp với mọi lứa tuổi</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="py-2 px-4 border-b font-medium">Phù hợp</td>
                                            <td className="py-2 px-4 border-b">Đi làm, đi chơi, dạo phố</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div className="space-y-6">
                                {/* Sample reviews */}
                                {item.feedbacks?.map((review, index) => (
                                    <div key={index} className="border-b pb-4">
                                        <div className="flex justify-between items-center">
                                            <div className="font-medium">{review.name}</div>
                                            <div className="text-sm text-gray-500">{dateTime(review.time)}</div>
                                        </div>
                                        <div className="flex my-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={16}
                                                    className={star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-gray-700 text-sm mt-1">{review.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Product recommendations */}
                {/* <div className="mt-12">
                    <h3 className="text-xl font-bold mb-6">Có thể bạn cũng thích</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {
                            products.map(product => (
                                <CardProduct key={product.id} product={product}/>
                            ))
                        }
                    </div>
                </div> */}
            </div>

            {showGuide && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <div className="custom-modal-header">
                            <h2 className="custom-modal-title">BẢNG TƯ VẤN SIZE</h2>
                            <button
                                className="custom-modal-close"
                                onClick={() => setShowGuide(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="custom-modal-body">
                            <table className="size-guide-table">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-3 px-6 text-left font-semibold text-gray-800">Kích cỡ</th>
                                        <th className="py-3 px-6 text-left font-semibold text-gray-800">Mô tả</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listSizes.map((size, index) => (
                                        <tr
                                            key={index}
                                            className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                } hover:bg-blue-50 transition-colors duration-200`}
                                        >
                                            <td className="py-4 px-6 font-medium text-gray-900">{size.name}</td>
                                            <td className="py-4 px-6 text-gray-700">{size.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductDetail;