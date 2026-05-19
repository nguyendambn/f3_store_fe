import { Popover, Transition } from "@headlessui/react";
import { Bell, ChevronDown, Heart, History, LogOut, Menu, Package, Search, Settings, ShoppingCart, User, UserRound, X } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { findProductUser } from "../../../../helpers/findProductUser";
import RenderCategoryTree from "../../../../helpers/treeCategory.user";
import { Introspect } from "../../../../hooks/introspect";
import { ListCategory } from "../../../../hooks/listCategory";
import { updateCart } from "../../../../services/Client/shopping.service";
import { handleLogout } from "../../../../view/auth/logout";
import { addCart, removeItem } from "../../../action/index.action";
import { toast, ToastContainer } from "react-toastify";
import { notification } from "../../../../helpers/toast";

export default function Header({ headerRef }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isFirstRun = useRef(true);
    const { categories } = ListCategory();
    const [menuOpen, setMenuOpen] = useState(false);
    const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const infor = Object.keys(useSelector(state => state.infor)).length > 0 ? useSelector(state => state.infor) : null;

    const cart = useSelector(state => state.cart);
    const favorite = useSelector(state => state.favorite);


    const totalPrice = cart.reduce((total, item) => total + Math.round(item.price * (1 - item.percent / 100)) * item.quantity, 0)
    const [options, setOptions] = useState({
        categoryId: "",
        searchKey: ""
    });

    const products = findProductUser(options);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setOptions(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleNavigate = () => {
        if (!localStorage.getItem("accessToken")) {
            notification(toast, "Vui lòng đăng nhập để thực hiện chức năng này");
            return;
        }
        navigate("/payment");
    }

    const closeCart = useCallback(() => {
        setIsClosing(true); // Ẩn panel ngay lập tức
        requestAnimationFrame(() => {
            setIsCartOpen(false);
            setTimeout(() => setIsClosing(false), 300); // Reset sau khi animation hoàn tất
        });
    }, []);

    useEffect(() => {
        if (menuOpen || categoryMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [menuOpen, categoryMenuOpen]);

    const navigation = [
        { name: "Trang chủ", href: "/" },
        { name: "Về chúng tôi", href: "#" },
        { name: "Tin tức", href: "#" },
        { name: "Liên hệ", href: "#" },
        { name: "Danh mục sản phẩm", hasCategory: true }
    ];

    const handleChangeQuantity = (index, type) => {
        const newCart = [...cart];
        const item = newCart[index];
        const cartItem = {
            id: item.id,
            color: {
                id: item.color.id
            },
            size: {
                id: item.size.id
            }
        };
        if (type === 'decrease' && item.quantity > 1) {
            cartItem.quantity = item.quantity - 1;
        } else if (type === 'increase' && item.quantity < item.stock) {
            cartItem.quantity = item.quantity + 1;
        }
        dispatch(addCart(cartItem));
    };
    const handleRemoveItem = (i) => {
        const item = cart[i];
        dispatch(removeItem({
            id: item.id,
            color: {
                id: item.color.id
            },
            size: {
                id: item.size.id
            }
        }))
    }
    const isValid = Introspect();
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        const fetchApi = async () => {
            if (isValid) {
                const res = await updateCart(cart);
            }
        }
        fetchApi();
    }, [cart]);
    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 bg-white" ref={headerRef}>
                <div className="border-b border-gray-100">
                    <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto">
                        <div className="md:hidden">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
                            >
                                {menuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>

                        <div className="flex items-center">
                            <img
                                
                                src="https://res.cloudinary.com/dq4guha5o/image/upload/v1764510837/z7278593864790_3ec1700afa61d2854e993050e4023ad8_mvtoh5.jpg"
                                alt="Logo"
                                // className="h-16 md:h-20 w-full"
                                className="h-16 md:h-20 w-20" 
                                
                            />
                        </div>

                        <nav className="hidden md:flex items-center space-x-8">
                            {navigation.map((item) => (
                                <div key={item.name} className="relative group">
                                    {item.hasCategory ? (
                                        <Popover className="relative">
                                            {({ open }) => (
                                                <>
                                                    <Popover.Button
                                                        onClick={() => handleChange({ target: { name: 'categoryId', value: "" } })}
                                                        className="font-medium text-gray-700 hover:text-black py-2 transition-colors duration-200 flex items-center focus:outline-none">
                                                        {item.name}
                                                        <ChevronDown className="ml-1 w-4 h-4" />
                                                    </Popover.Button>
                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-200"
                                                        enterFrom="opacity-0"
                                                        enterTo="opacity-100"
                                                        leave="transition ease-in duration-150"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <Popover.Panel className="absolute top-full left-0 z-50 mt-2 w-80 bg-white shadow-lg rounded-md overflow-hidden">
                                                            <div className="p-4">
                                                                <div className="space-y-1">
                                                                    <RenderCategoryTree categories={categories} handleChange={handleChange} />
                                                                </div>
                                                            </div>
                                                        </Popover.Panel>
                                                    </Transition>
                                                </>
                                            )}
                                        </Popover>
                                    ) : (
                                        <a
                                            href={item.href}
                                            className="font-medium text-gray-700 hover:text-black py-2 transition-colors duration-200 flex items-center"
                                        >
                                            {item.name}
                                            {item.hasSubmenu && <ChevronDown className="ml-1 w-4 h-4" />}
                                        </a>
                                    )}

                                    {item.hasSubmenu && (
                                        <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left">
                                            <div className="py-2">
                                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sản phẩm mới</a>
                                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Khuyến mãi</a>
                                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Bán chạy nhất</a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        <div className="flex items-center space-x-5">
                            <Popover className="relative hidden md:block">
                                {({ open }) => (
                                    <>
                                        <Popover.Button className="rounded-md p-1.5 hover:bg-gray-100 transition-colors duration-200 focus:outline-none">
                                            <Search className="w-5 h-5" />
                                        </Popover.Button>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="opacity-0 translate-y-1"
                                            enterTo="opacity-100 translate-y-0"
                                            leave="transition ease-in duration-150"
                                            leaveFrom="opacity-100 translate-y-0"
                                            leaveTo="opacity-0 translate-y-1"
                                        >
                                            <Popover.Panel className="absolute right-0 mt-2 w-80 rounded-md bg-white shadow-lg p-4 z-50">
                                                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                                    <input
                                                        type="text"
                                                        name="searchKey"
                                                        value={options.searchKey}
                                                        onChange={handleChange}
                                                        placeholder="Tìm kiếm sản phẩm..."
                                                        className="w-full px-4 py-2 focus:outline-none text-sm"
                                                    />

                                                </div>
                                            </Popover.Panel>
                                        </Transition>
                                    </>
                                )}
                            </Popover>

                            {/* {infor && (
                                <Popover className="relative hidden md:block">
                                    {({ open }) => (
                                        <>
                                       
                                        <Popover.Button className="rounded-md p-1.5 hover:bg-gray-100 transition-colors duration-200 focus:outline-none">
                                                <div className="relative">
                                                    <Bell className="w-5 h-5" />
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-medium">
                                                        3
                                                    </span>
                                                </div>
                                            </Popover.Button>
                                        
                                            
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-200"
                                                enterFrom="opacity-0 translate-y-1"
                                                enterTo="opacity-100 translate-y-0"
                                                leave="transition ease-in duration-150"
                                                leaveFrom="opacity-100 translate-y-0"
                                                leaveTo="opacity-0 translate-y-1"
                                            >
                                                <Popover.Panel className="absolute right-0 mt-2 w-80 rounded-md bg-white shadow-lg overflow-hidden z-50">
                                                    <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                                                        <h3 className="font-medium">Thông báo</h3>
                                                        <button className="text-xs text-blue-600 hover:underline">Đánh dấu đã đọc</button>
                                                    </div>
                                                    <div className="max-h-80 overflow-y-auto">
                                                        <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-start">
                                                            <span className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                                                            <div>
                                                                <p className="text-sm">Đơn hàng #12345 của bạn đã được giao thành công.</p>
                                                                <p className="text-xs text-gray-500 mt-1">2 giờ trước</p>
                                                            </div>
                                                        </div>
                                                        <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-start">
                                                            <span className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                                                            <div>
                                                                <p className="text-sm">Sản phẩm yêu thích của bạn đang được giảm giá 20%.</p>
                                                                <p className="text-xs text-gray-500 mt-1">Hôm qua</p>
                                                            </div>
                                                        </div>
                                                        <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-start">
                                                            <span className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                                                            <div>
                                                                <p className="text-sm">Chúng tôi vừa cập nhật chính sách giao hàng mới.</p>
                                                                <p className="text-xs text-gray-500 mt-1">2 ngày trước</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 text-center border-t border-gray-100">
                                                        <a href="#" className="text-sm text-blue-600 hover:underline">Xem tất cả thông báo</a>
                                                    </div>
                                                </Popover.Panel>
                                            </Transition>
                                        </>
                                    )}
                                </Popover>
                            )} */}

                            <Popover className="relative">
                                {({ open }) => (
                                    <>
                                        <Popover.Button className="rounded-md p-1.5 hover:bg-gray-100 transition-colors duration-200 focus:outline-none">
                                            {infor ? (
                                                <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
                                                    <img
                                                        src={infor.avatar}
                                                        alt={infor.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <UserRound className="w-5 h-5" />
                                            )}
                                        </Popover.Button>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="opacity-0 translate-y-1"
                                            enterTo="opacity-100 translate-y-0"
                                            leave="transition ease-in duration-150"
                                            leaveFrom="opacity-100 translate-y-0"
                                            leaveTo="opacity-0 translate-y-1"
                                        >
                                            <Popover.Panel className="absolute right-0 mt-2 w-72 rounded-md bg-white shadow-lg overflow-hidden z-50">
                                                {infor ? (
                                                    <>
                                                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                                                            <div className="flex items-center">
                                                                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-200">
                                                                    <img
                                                                        src={infor.avatar}
                                                                        alt={infor.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">{infor.name}</p>
                                                                    <p className="text-xs text-gray-500">Thành viên VIP</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="py-2">
                                                            <Link to={"/infor"} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                <span className="mr-3 ">
                                                                    <User color="#2e0a17" />
                                                                </span> Thông tin tài khoản
                                                            </Link>
                                                            <Link to={"/order"} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                <span className="mr-3">
                                                                    <Package color="#bebb60" />
                                                                </span> Đơn hàng của tôi
                                                            </Link>
                                                            <Link to={"/favorite"} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                <span className="mr-3">
                                                                    <Heart color="#f00a0a" />
                                                                </span> Sản phẩm yêu thích
                                                                {/* <span className="ml-auto bg-gray-100 text-xs px-2 py-0.5 rounded-full"></span> */}
                                                            </Link>
                                                            {/* <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                <span className="mr-3">
                                                                    <History color="#0acaf0" />
                                                                </span> Lịch sử giao dịch
                                                            </a>
                                                            <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                <span className="mr-3">
                                                                    <Settings color="#6e7a7c" />
                                                                </span> Cài đặt tài khoản
                                                            </a> */}
                                                        </div>
                                                        <div className="p-3 border-t border-gray-100">
                                                            <button
                                                                onClick={() => handleLogout()}
                                                                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                                            >
                                                                <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="p-6 border-b border-gray-100">
                                                            <Link to={"/login"}>
                                                                <button className="bg-black text-white py-2.5 rounded-md w-full font-medium hover:bg-gray-800 transition-colors duration-200">
                                                                    ĐĂNG NHẬP
                                                                </button>
                                                            </Link>
                                                            <Link to={"/register"}>
                                                                <p className="mt-4 text-gray-600 text-center text-sm">
                                                                    Chưa có tài khoản?{" "}
                                                                    <span className="text-black font-medium hover:text-gray-700">
                                                                        Đăng ký
                                                                    </span>
                                                                </p>
                                                            </Link>
                                                        </div>
                                                    </>
                                                )}
                                            </Popover.Panel>
                                        </Transition>
                                    </>
                                )}
                            </Popover>

                            <button className="rounded-md p-1.5 hover:bg-gray-100 transition-colors duration-200 hidden md:block" onClick={()=>navigate('/favorite')}>
                                <Heart className="w-5 h-5" style={{position:'relative',top:'10px'}} />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold"
                                 style={{position:'relative',top:'-24px',right:'-10px'}}>
                                       {favorite.length}
                                </span>
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setIsCartOpen(true)}
                                    className="relative rounded-md p-1.5 hover:bg-gray-100 transition"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                                        {cart.length}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <Transition
                    show={menuOpen}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 -translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-1"
                >
                    <div className="md:hidden fixed top-16 left-0 w-full bg-white shadow-md border-t border-gray-100 max-h-[calc(100vh-4rem)] overflow-y-auto">
                        {infor && (
                            <div className="p-4 border-b border-gray-100 bg-gray-50">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 mr-3">
                                        <img
                                            src={infor.avatar}
                                            alt={infor.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">{infor.name}</p>
                                        <p className="text-xs text-gray-500">Thành viên VIP</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="p-4 bg-gray-50 border-b border-gray-100">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="searchKey"
                                    placeholder="Tìm kiếm sản phẩm"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-sm"
                                />
                                <Search className="absolute right-3 top-2.5 text-gray-400 w-4 h-4" />
                            </div>
                        </div>
                        <nav className="py-2">
                            {navigation.map((item, index) => (
                                <div key={index}>
                                    {item.hasCategory ? (
                                        <div>
                                            <button
                                                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                                                className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                                            >
                                                <span className="font-medium">{item.name}</span>
                                                <ChevronDown className={`w-4 h-4 transition-transform ${categoryMenuOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            {categoryMenuOpen && (
                                                <RenderCategoryTree categories={categories} />
                                            )}
                                        </div>
                                    ) : (
                                        <a
                                            href={item.href}
                                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            <span className="font-medium">{item.name}</span>
                                            {item.hasSubmenu && <ChevronDown className="w-4 h-4" />}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {infor ? (
                            <div className="bg-gray-50 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <a href="#" className="text-sm font-medium hover:underline flex items-center">
                                        <span className="mr-2"><Package color="#bebb60" /></span> Đơn hàng của tôi
                                    </a>
                                </div>
                                <div className="flex items-center justify-between">
                                    <a href="#" className="text-sm font-medium hover:underline flex items-center">
                                        <span className="mr-2"><Heart color="#f00a0a" /></span> Sản phẩm yêu thích
                                    </a>
                                </div>
                                <button
                                    onClick={() => handleLogout()}
                                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors mt-2"
                                >
                                    <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 flex items-center justify-between">
                                <Link to={"/login"}>
                                    <a href="#" className="text-sm font-medium hover:underline">Đăng nhập</a>
                                </Link>
                                <span className="text-gray-300">|</span>
                                <Link to={"/register"}>
                                    <a href="#" className="text-sm font-medium hover:underline">Đăng ký</a>
                                </Link>
                            </div>
                        )}
                    </div>
                </Transition>
            </header>


            {/* Drawer Giỏ hàng */}

            <Transition
                show={isCartOpen}
                as={Fragment}
                appear={true}
                enter="transition ease-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in duration-400 transform" // Tăng lên 400ms cho mượt hơn
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
            >
                <div className="fixed inset-0 z-[100] overflow-hidden">
                    {/* Overlay */}
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-in duration-400" // Đồng bộ với panel
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={closeCart}
                        />
                    </Transition.Child>

                    {/* Panel */}
                    <div
                        className={`absolute right-0 top-0 w-full sm:max-w-lg h-full bg-white shadow-2xl flex flex-col will-change-transform ${isClosing ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Giỏ hàng của bạn</h2>
                            <button
                                onClick={closeCart}
                                className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                            >
                                <X className="w-6 h-6 text-gray-600 hover:text-red-500" />
                            </button>
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-200 p-4 bg-gray-50">
                            {cart.length > 0 ? (
                                cart.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex gap-4 p-4 hover:bg-white rounded-lg transition-colors duration-200"
                                    >
                                        <img
                                            src={item.image.src}
                                            alt="Sản phẩm"
                                            className="w-24 h-28 rounded-lg object-cover border border-gray-200"
                                        />
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="text-base font-semibold text-gray-900 leading-tight">
                                                    {item.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-1">Màu: {item.color.name} | Size: {item.size.name}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center w-[100px] h-9 border border-gray-300 rounded-md overflow-hidden">
                                                    <button
                                                        onClick={() => handleChangeQuantity(i, 'decrease')}
                                                        disabled={item.quantity <= 1}
                                                        className="w-1/3 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={item.quantity}
                                                        min="1"
                                                        max={item.stock}
                                                        className="w-1/3 h-full text-center text-sm font-medium text-gray-800 outline-none"
                                                    />
                                                    <button
                                                        onClick={() => handleChangeQuantity(i, 'increase')}
                                                        disabled={item.quantity >= item.stock}
                                                        className="w-1/3 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {item.percent ? (
                                                    <div className="text-right">
                                                        <p className="text-base font-bold text-red-600">
                                                            {(item.price * (1 - item.percent / 100) * item.quantity).toLocaleString()}₫
                                                        </p>
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <span className="text-sm text-gray-400 line-through">
                                                                {(item.price * item.quantity).toLocaleString()}₫
                                                            </span>
                                                            <span className="text-sm font-medium text-red-500">
                                                                -{item.percent}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-base font-bold text-gray-800">
                                                        {(item.price * item.quantity).toLocaleString()}₫
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-red-500 transition-colors duration-200">
                                            <X
                                                onClick={() => handleRemoveItem(i)}
                                                className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingCart className="w-12 h-12 text-gray-400 mb-4" />
                                    <p className="text-gray-600 font-medium">Giỏ hàng của bạn đang trống</p>
                                    <a
                                        href="#"
                                        className="mt-4 text-sm text-blue-600 hover:underline"
                                        onClick={closeCart}
                                    >
                                        Tiếp tục mua sắm
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-gray-200 bg-white">
                            <div className="flex justify-between items-center text-lg font-semibold text-gray-800 mb-4">
                                <span>Tổng cộng:</span>
                                <span className="text-red-600">{totalPrice.toLocaleString()}₫</span>
                            </div>
                            <Link to={"/shopping-cart"}>
                                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-base font-semibold transition-all duration-200 shadow-md">
                                    Xem giỏ hàng
                                </button>
                            </Link>
                            <button
                                onClick={handleNavigate}
                                className="w-full py-3 mt-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-base font-semibold transition-all duration-200">
                                Thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </>
    );
}