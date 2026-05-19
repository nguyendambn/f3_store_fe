import { ArrowRight, Clock, Eye, Phone, Plus, RefreshCw, ShieldCheck, Star, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import CardProduct from '../../../components/pages/home/CardProduct';
import ProductSlider from "../../../components/pages/home/ProductSlide";
import { ListCategory } from "../../../hooks/listCategory";
// import { homeJquery } from '../../../jquery/home.jquery';

export default function Home() {
    const navigate = useNavigate();
    const { categories } = ListCategory();
    const products = useSelector(state => state.productForUser);
    const cart = useSelector(state => state.cart);
    const feedback = products.filter(item => item.feedbacks.length > 0).map(item => item.feedbacks);
    const dealProducts = products.filter(item => item.discounts.length > 0);
    const shirts = products.filter(item =>
        item.name.normalize("NFC").includes("Áo")
    );
    const trousers = products.filter(item =>
        item.name.normalize("NFC").includes("Quần")
    );
    const shoes = products.filter(item =>
        item.name.normalize("NFC").includes("Giày")
    );

    const productsWithTotalSold = products.map(product => ({
        ...product,
        totalSold: product.details.reduce((sum, d) => sum + d.soldCount, 0)
    }));

    const topBestSeller = productsWithTotalSold
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 4);

    const [visible, setVisible] = useState(8);

    const heroImages = [
        "http://res.cloudinary.com/dxx1lgamz/image/upload/6a0ce971-7007-4c0a-865a-bde7d826ee7a_biti-huner-cam",
        "http://res.cloudinary.com/dxx1lgamz/image/upload/6f45d675-1730-4f33-99ec-0256711226cd_adidas-utraboost-den",
        "http://res.cloudinary.com/dxx1lgamz/image/upload/f8b75f21-e81a-4b53-aba2-8b31cd64e1d1_nike-air-jordan-xanh-duong"
    ];


    // useEffect(() => {
    //     homeJquery();
    // }, [categories]);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentDealSlide, setCurrentDealSlide] = useState(0);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    //     }, 3000);
    //     return () => clearInterval(interval);
    // }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDealSlide((prev) => (prev + 1) % dealProducts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [dealProducts.length]);

    const [timeLeft, setTimeLeft] = useState({
        days: 360,
        hours: 24,
        minutes: 59,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                let { days, hours, minutes, seconds } = prevTime;

                if (seconds > 0) {
                    seconds -= 1;
                } else {
                    seconds = 59;
                    if (minutes > 0) {
                        minutes -= 1;
                    } else {
                        minutes = 59;
                        if (hours > 0) {
                            hours -= 1;
                        } else {
                            hours = 23;
                            if (days > 0) {
                                days -= 1;
                            }
                        }
                    }
                }

                return { days, hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);


    return (
        <>
            <ToastContainer position="top-center" autoClose={2000} pauseOnHover={false} />
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-xl h-[400px] sm:h-[500px] mb-4 sm:mb-16 shadow-xl group mt-20 sm:mt-24">
                {/* Main slider container */}
                <div
                    key={currentSlide}
                    className="flex h-full transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {heroImages.map((img, index) => {
                        const slideContent = [
                            {
                                tagline: "Chào mừng đến F3 STORE",
                                title: ["Điểm đến thời trang", "của bạn"],
                                highlight: "đang chờ đón",
                                description: "Khám phá những xu hướng mới nhất và phong cách vượt thời gian trong bộ sưu tập được tuyển chọn của chúng tôi. Từ trang phục hàng ngày đến những bộ váy dạ hội thanh lịch.",
                                button1: "Khám phá bộ sưu tập",
                                button2: "Về chúng tôi"
                            },
                            {
                                tagline: "Xu hướng mới 2026",
                                title: ["Phong cách hiện đại", "thời thượng"],
                                highlight: "dành cho bạn",
                                description: "Cập nhật ngay những mẫu thiết kế hot nhất năm 2026. Từ streetwear năng động đến business chic, tất cả đều có tại StyleHub với giá cả hợp lý nhất.",
                                button1: "Xem xu hướng mới",
                                button2: "Sale up to 50%"
                            },
                            {
                                tagline: "Chất lượng cao cấp",
                                title: ["Thời trang bền vững", "giá tốt nhất"],
                                highlight: "tại Việt Nam",
                                description: "Cam kết mang đến những sản phẩm chất lượng cao với chính sách đổi trả linh hoạt. Miễn phí giao hàng toàn quốc cho đơn hàng từ 500k.",
                                button1: "Mua ngay",
                                button2: "Liên hệ tư vấn"
                            }
                        ];

                        const content = slideContent[index] || slideContent[0];

                        return (
                            <div
                                key={index}
                                className="w-full h-full flex-shrink-0 sm:h-[500px] flex relative bg-gradient-to-r from-pink-50 via-white to-purple-50"
                            >
                                {/* Decorative background circles */}
                                <div className="absolute inset-0 opacity-10 hidden sm:block">
                                    <div className="absolute top-12 left-12 w-32 h-32 rounded-full bg-pink-300" />
                                    <div className="absolute bottom-16 right-20 w-24 h-24 rounded-full bg-purple-300" />
                                </div>

                                {/* TEXT CONTENT */}
                                <div className="w-full sm:w-1/2 flex flex-col justify-center p-4 sm:pl-[100px] z-10">
                                    <div
                                        className="relative mb-2 animate__animated animate__fadeInDown"
                                        style={{ animationDelay: '0.2s' }}
                                    >
                                        <p className="text-xs sm:text-sm font-medium text-pink-600 uppercase tracking-widest">
                                            {content.tagline}
                                        </p>
                                    </div>

                                    <h2
                                        className="text-xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-2 sm:mb-6 animate__animated animate__fadeInDown"
                                        style={{ animationDelay: '0.3s' }}
                                    >
                                        {content.title[0]}<br />
                                        {content.title[1]} <span className="text-pink-600">{content.highlight}</span>
                                    </h2>

                                    <p
                                        className="text-xs sm:text-base text-gray-600 mb-2 sm:mb-8 max-w-[200px] sm:max-w-md animate__animated animate__fadeInDown"
                                        style={{ animationDelay: '0.4s' }}
                                    >
                                        {content.description}
                                    </p>

                                    <div
                                        className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 animate__animated animate__fadeInDown"
                                        style={{ animationDelay: '0.5s' }}
                                    >
                                        <button className="bg-pink-500 hover:bg-pink-600 transition-all duration-300 text-white py-2 sm:py-3 px-4 sm:px-8 rounded-full text-xs sm:text-sm font-semibold shadow-lg hover:shadow-pink-200 transform hover:-translate-y-1">
                                            {content.button1}
                                        </button>
                                        <button className="border-2 border-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-300 text-gray-800 py-2 sm:py-3 px-4 sm:px-8 rounded-full text-xs sm:text-sm font-semibold transform hover:-translate-y-1">
                                            {content.button2}
                                        </button>
                                    </div>
                                </div>

                                {/* VISUAL CONTENT */}
                                <div className="w-full sm:w-1/2 h-[200px] sm:h-[500px] flex items-center justify-center relative px-2 sm:px-8">
                                    {/* Background decorative elements */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-48 sm:w-96 h-48 sm:h-96 rounded-full bg-gradient-to-tr from-pink-100 to-purple-100 shadow-2xl opacity-80" />
                                    </div>

                                    {/* Central visual elements */}
                                    <div className="relative z-10 flex flex-col items-center justify-center space-y-4 sm:space-y-6">
                                        {/* Fashion icons/symbols */}
                                        <div className="flex space-x-4 sm:space-x-8 items-center">
                                            <div className="w-12 sm:w-20 h-12 sm:h-20 bg-pink-500 rounded-full flex items-center justify-center shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-500">
                                                <svg className="w-6 sm:w-10 h-6 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                            </div>
                                            <div className="w-16 sm:w-28 h-16 sm:h-28 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-pink-200">
                                                <div className="text-center">
                                                    <div className="text-lg sm:text-3xl font-bold text-pink-600">F3</div>
                                                    <div className="text-xs sm:text-sm text-gray-600">STORE</div>
                                                </div>
                                            </div>
                                            <div className="w-12 sm:w-20 h-12 sm:h-20 bg-purple-500 rounded-full flex items-center justify-center shadow-lg transform -rotate-12 hover:rotate-0 transition-transform duration-500">
                                                <svg className="w-6 sm:w-10 h-6 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Brand tagline */}
                                        <div className="text-center">
                                            <div className="text-xs sm:text-lg text-gray-600 font-medium mb-1 sm:mb-2">HÀNH TRÌNH PHONG CÁCH CỦA BẠN</div>
                                            <div className="text-lg sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                                                Ở ĐÂY
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating elements */}
                                    <div className="absolute top-8 sm:top-16 right-4 sm:right-8 w-8 sm:w-12 h-8 sm:h-12 bg-pink-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }} />
                                    <div className="absolute bottom-8 sm:bottom-16 left-4 sm:left-8 w-6 sm:w-10 h-6 sm:h-10 bg-purple-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s' }} />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* DOT INDICATORS */}
                <div className="absolute bottom-2 sm:bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-pink-500 scale-125' : 'bg-gray-300'
                                }`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>

                {/* NAVIGATION ARROWS */}
                <button
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-90 rounded-full p-1 sm:p-2 text-pink-600 hover:text-pink-800 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md"
                    onClick={() =>
                        setCurrentSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1))
                    }
                    aria-label="Previous slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-6 w-4 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-90 rounded-full p-1 sm:p-2 text-pink-600 hover:text-pink-800 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md"
                    onClick={() =>
                        setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1))
                    }
                    aria-label="Next slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-6 w-4 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Main content */}
            <div className="py-2 sm:py-8">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-8">
                    {/* Sidebar */}
                    <div className="col-span-1 hidden sm:block sticky top-24 self-start space-y-2 sm:space-y-8">
                        <div className="mb-8 border p-2 rounded-lg">
                            <h2 className="font-semibold mb-4">CATEGORY</h2>
                            <ul>
                                {categories.map((category, index) => (
                                    <li key={index} className="py-2 border-border-gray-100">
                                        <div className='flex justify-between items-center '>
                                            <div>

                                                <span>{category.name}</span>
                                            </div>
                                            <span className="text-gray-400 cursor-pointer show-sub-category"><Plus size={16} /></span>
                                        </div>
                                        <div className='hidden content-slide'>
                                            <div className="mt-2 pt-1 ml-1 text-sm text-gray-600 border-t-2 space-y-2">
                                                {category.children && category.children.length > 0 && category.children.map(sub => (
                                                    <div className="flex justify-between">
                                                        <span>{sub.name}</span>

                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-2 sm:mb-8">
                            <h2 className="font-semibold text-xs sm:text-base mb-1 sm:mb-4">BEST SELLERS</h2>
                            {topBestSeller.map((product) => (
                                <div key={product.id} className="flex mb-1 sm:mb-4">
                                    <div className="w-12 sm:w-16 h-12 sm:h-16 mr-1 sm:mr-4">
                                        <img src={product.images[0].src} alt={product.name} className="w-full h-full object-cover rounded" />
                                    </div>
                                    <Link to={`/detail/${product.slug}`}>
                                        <h3 className="text-xs sm:text-sm font-medium">{product.name}</h3>
                                        <div className="flex space-x-0.5 sm:space-x-1 items-center text-yellow-400 text-[8px] sm:text-xs my-0.5 sm:my-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={8} sm:size={12} fill={"currentColor"} />
                                            ))}
                                        </div>
                                        <div className="flex items-center">
                                            {
                                                product.discounts?.length > 0 ? (
                                                    <>
                                                        <span className="text-xs sm:text-sm font-medium text-gray-900">{Math.round(product.price * (1 - product.discounts[0].percent / 100)).toLocaleString()}₫</span>
                                                        <span className="ml-1 sm:ml-2 text-[8px] sm:text-xs text-gray-400 line-through">{product.price.toLocaleString()}₫</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-xs sm:text-sm font-medium text-gray-900">{product.price.toLocaleString()}₫</span>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main product listings */}
                    <div className="col-span-1 sm:col-span-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-2 sm:mb-8">
                            <ProductSlider items={shirts} title="Áo" itemsPerPage={3} />
                            <ProductSlider items={trousers} title="Quần" itemsPerPage={3} />
                            <ProductSlider items={shoes} title="Giầy" itemsPerPage={3} />
                        </div>

                        {/* Deal of the day */}
                        <div className="max-w-full mx-auto p-2 sm:p-6">
                            <div className="mb-2 sm:mb-12">
                                <div className="flex items-center justify-between mb-1 sm:mb-6">
                                    <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Giảm giá trong ngày</h2>
                                </div>

                                <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-md sm:shadow-lg group">
                                    {/* Main slider container */}
                                    <div
                                        className="flex transition-transform duration-700 ease-out"
                                        style={{ transform: `translateX(-${currentDealSlide * 100}%)` }}
                                    >
                                        {dealProducts.map((product, index) => (
                                            <div
                                                key={index}
                                                className="w-full flex-shrink-0 flex flex-col sm:flex-row bg-gradient-to-r from-pink-50 via-white to-pink-50"
                                            >
                                                {/* Decorative elements */}
                                                <div className="absolute top-0 left-0 w-full h-full opacity-10 hidden sm:block">
                                                    <div className="absolute top-12 left-12 w-32 h-32 rounded-full bg-pink-300"></div>
                                                    <div className="absolute bottom-16 right-20 w-24 h-24 rounded-full bg-purple-300"></div>
                                                </div>

                                                {/* Product Image */}
                                                <div className="w-full sm:w-2/5 p-2 sm:p-8 flex items-center justify-center relative z-10">
                                                    <div className="relative group">
                                                        <img
                                                            src={product.images[0].src}
                                                            alt={product.name}
                                                            className="h-32 sm:h-64 object-contain transition-transform duration-500 transform group-hover:scale-105 drop-shadow-xl"
                                                        />
                                                        <div className="absolute top-0 right-0 bg-pink-500 text-white text-xs font-bold px-1 sm:px-2 py-0.5 sm:py-1 rounded-bl-lg">
                                                            {product.discounts[0]?.percent}%
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Product Details */}
                                                <div className="w-full sm:w-3/5 p-2 sm:p-8 flex flex-col justify-center z-10">
                                                    <div className="flex items-center mb-1 sm:mb-2">
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <span key={i} className="text-xs sm:text-base">★</span>
                                                            ))}
                                                        </div>
                                                        <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500">({product.feedbacks?.length} đánh giá)</span>
                                                    </div>

                                                    <h3 className="text-base sm:text-2xl font-bold mb-1 sm:mb-2 text-gray-800">{product.name}</h3>

                                                    <p className="text-xs sm:text-gray-600 mb-2 sm:mb-4 leading-relaxed line-clamp-2 sm:line-clamp-none">{product.description}</p>

                                                    <div className="flex items-center mb-2 sm:mb-6">
                                                        <span className="text-lg sm:text-3xl font-bold text-pink-600">{(Math.round(product.price * (1 - product.discounts[0].percent / 100))).toLocaleString()}₫</span>
                                                        <span className="ml-1 sm:ml-3 text-base sm:text-lg text-gray-400 line-through">{(product.price).toLocaleString()}₫</span>
                                                    </div>

                                                    <div className="flex flex-col space-y-2 sm:space-y-6">
                                                        <div className="space-y-1 sm:space-y-2">
                                                            <div className="flex justify-between text-xs sm:text-sm">
                                                                <span className="font-medium text-gray-700">Số lượng đã bán: {product.details?.reduce((total, item) => total + item.soldCount, 0)}</span>
                                                                <span className="font-medium text-gray-700">Còn lại: {product.quantity}</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-1 sm:h-2">
                                                                <div
                                                                    className="bg-pink-500 h-1 sm:h-2 rounded-full"
                                                                    style={{ width: `${(product.details?.reduce((total, item) => total + item.soldCount, 0) / (product.details?.reduce((total, item) => total + item.soldCount, 0) + product.quantity)) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1 sm:space-y-2">
                                                            <div className="flex items-center text-gray-700">
                                                                <Clock className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2 text-pink-500" />
                                                                <span className="font-medium text-xs sm:text-base">Nhanh lên! Mã giảm giá sẽ hết hạn sau:</span>
                                                            </div>

                                                            <div className="flex space-x-1 sm:space-x-3">
                                                                {Object.entries(timeLeft).map(([unit, value]) => (
                                                                    <div key={unit} className="bg-gray-50 p-1 sm:p-3 rounded-md sm:rounded-lg shadow-sm flex flex-col items-center flex-1">
                                                                        <span className="text-sm sm:text-xl font-bold text-gray-800">{String(value).padStart(2, '0')}</span>
                                                                        <span className="text-[8px] sm:text-xs font-medium text-gray-500 capitalize">{unit}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => navigate(`/detail/${product.slug}`)}
                                                            className="flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white py-1 sm:py-3 px-2 sm:px-6 rounded-md sm:rounded-lg font-medium transition duration-200 shadow-md transform hover:-translate-y-0.5 sm:hover:-translate-y-1">
                                                            <Eye className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2" />
                                                            Xem chi tiết sản phẩm
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Arrow Navigation */}
                                    <button
                                        className="absolute left-1 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-90 rounded-full p-1 sm:p-2 text-pink-600 hover:text-pink-800 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md"
                                        onClick={() =>
                                            setCurrentDealSlide((prev) => (prev === 0 ? dealProducts.length - 1 : prev - 1))
                                        }
                                        aria-label="Previous slide"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-6 w-4 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    <button
                                        className="absolute right-1 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-90 rounded-full p-1 sm:p-2 text-pink-600 hover:text-pink-800 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md"
                                        onClick={() =>
                                            setCurrentDealSlide((prev) => (prev === dealProducts.length - 1 ? 0 : prev + 1))
                                        }
                                        aria-label="Next slide"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-6 w-4 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* New Products */}
                        <div className="mb-2 sm:mb-12">
                            <h2 className="font-semibold mb-1 sm:mb-6">Sản phẩm của chúng tôi</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                                {products.slice(0, visible).map((product) => (
                                    <CardProduct product={product} key={product.id} />
                                ))}
                            </div>
                            <button
                                onClick={() => setVisible(pre => pre + 8)}
                                className="mt-6 mx-auto block bg-black text-white px-5 py-2 rounded-full shadow-md hover:bg-gray-800 hover:scale-105 transition duration-300 ease-in-out"
                            >
                                Xem thêm
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonial */}
            <div className="px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-stretch">
                    <div className="md:col-span-1 space-y-6 h-full">
                        <h2 className="text-xl font-semibold border-b pb-2">Khách hàng nói gì về chúng tôi</h2>
                        {
                            feedback?.length > 0 && (
                                <div className="bg-white p-6 rounded-xl shadow text-center space-y-4">
                                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto">
                                        <img
                                            src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRQFcuPLHz8P3CNrDCTBb6_JIgxeMyCx4pvhByDyDSlHwZmUBut"
                                            alt="Alan Doe"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">{feedback[0][0].name}</h3>
                                    <p className="text-sm text-gray-500">Khách hàng gần đây</p>
                                    <div className="text-pink-500 text-4xl leading-none">“</div>
                                    <p className="text-sm text-gray-600">
                                        {feedback[0][0].description}
                                    </p>
                                </div>
                            )
                        }
                    </div>


                    {/* Banner */}
                    {/* Banner */}
                    <div className="md:col-span-2 h-full">
                        <div className="relative rounded-xl overflow-hidden h-full shadow bg-white">
                            <div className="flex flex-col justify-center items-center text-center text-gray-800 px-6 h-full py-12 space-y-4">
                                <span className="text-sm font-semibold text-pink-500 uppercase tracking-wide">
                                    Ưu đãi trong tuần
                                </span>
                                <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                                    Miễn phí giao hàng toàn quốc
                                </h3>
                                <p className="text-sm md:text-base text-gray-600 max-w-xl">
                                    Áp dụng cho mọi đơn hàng từ 300.000đ. Đặt hàng ngay để nhận tư vấn nhanh chóng và các chương trình khuyến mãi hấp dẫn!
                                </p>
                                <button className="bg-pink-500 hover:bg-pink-600 transition-all text-white py-2 px-8 rounded-full font-semibold text-sm flex items-center gap-2 shadow-md hover:scale-105">
                                    Đặt hàng ngay <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* Services */}
                    <div className="md:col-span-1 space-y-6 h-full">
                        <h2 className="text-xl font-semibold border-b pb-2">Dịch vụ của chúng tôi</h2>
                        <div className="bg-white p-6 rounded-xl shadow space-y-6">
                            {[
                                {
                                    icon: <Truck size={24} />,
                                    title: "Giao hàng miễn phí",
                                    desc: "Cho đơn hàng từ 500.000đ",
                                },
                                {
                                    icon: <Clock size={24} />,
                                    title: "Giao hàng nhanh",
                                    desc: "Nội thành nhận hàng trong 24h",
                                },
                                {
                                    icon: <Phone size={24} />,
                                    title: "Hỗ trợ online",
                                    desc: "Thời gian: 8AM - 11PM",
                                },
                                {
                                    icon: <RefreshCw size={24} />,
                                    title: "Chính sách hoàn trả",
                                    desc: "Dễ dàng và miễn phí",
                                },
                                {
                                    icon: <ShieldCheck size={24} />,
                                    title: "Bảo hành 30 ngày",
                                    desc: "Đổi trả dễ dàng, nhanh chóng",
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start space-x-4">
                                    <div className="text-pink-500">{item.icon}</div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800">{item.title}</h3>
                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}