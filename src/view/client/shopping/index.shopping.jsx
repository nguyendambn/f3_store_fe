import { useEffect, useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addCart, removeItem } from '../../../components/action/index.action';
import { addToCart, updateCart } from "../../../services/Client/shopping.service";
import { Introspect } from '../../../hooks/introspect';
import { notification } from '../../../helpers/toast';
import { toast, ToastContainer } from 'react-toastify';

export default function ShoppingCart() {
    const isFirstRun = useRef(true);
    const cart = useSelector(state => state.cart);
    const totalPrice = cart.reduce((total, item) => total + Math.round(item.price * (1 - item.percent / 100)) * item.quantity, 0);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const handleNavigate = () => {
        if (!localStorage.getItem("accessToken")) {
            notification(toast, "Vui lòng đăng nhập để thực hiện chức năng này");
            return;
        }
        navigate("/payment");
    }

    // Format currency
    const formatCurrency = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    };


    // Mobile product card view
    const MobileProductCard = ({ product, index }) => (
        <>
            <div className="bg-white border-b border-gray-200 py-4">
                <div className="flex items-center mb-2">
                    <div className="w-24 h-28 mr-4">
                        <img src={product.image.src} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{product.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">Màu sắc: {product.color.name}</p>
                        <p className="text-gray-500 text-sm">Size: {product.size.name}</p>
                        <div className="text-red-600 mt-1">
                            -{formatCurrency(product.price * (product.percent / 100) * product.quantity)}
                            <span className="ml-2">(-{product.percent}%)</span>
                        </div>
                        <div className="text-green-600 text-md mt-1 font-semibold">
                            {formatCurrency(Math.round(product.price * (1 - product.percent / 100)) * product.quantity)}
                        </div>
                    </div>
                    <button
                        className="text-gray-400 self-start ml-2"
                        onClick={() => handleRemoveItem(index)}
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
                <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center border border-gray-300 rounded w-fit">
                        <button
                            disabled={product.quantity <= 1}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 text-lg"
                            onClick={() => handleChangeQuantity(index, "decrease")}
                        >
                            −
                        </button>

                        <input
                            readOnly
                            type="text"
                            min={"1"}
                            max={product.stock}
                            value={product.quantity}
                            className="w-10 h-10 text-center border-l border-r border-gray-300 outline-none"
                        />

                        <button
                            disabled={product.quantity >= product.stock}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 text-lg"
                            onClick={() => handleChangeQuantity(index, "increase")}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
    // Desktop product row
    const DesktopProductRow = ({ product, index }) => (
        <div className="grid grid-cols-12 items-center py-5 border-t border-gray-200">
            <div className="col-span-5 flex items-center">
                <div className="w-24 h-28 mr-5 bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img src={product.image.src} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h3 className="font-medium text-gray-800">{product.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">Màu sắc: {product.color.name} &nbsp; Size: {product.size.name}</p>
                </div>
            </div>
            <div className="col-span-2 text-center">
                <p className="text-red-600 font-medium">-{formatCurrency(product.price * (product.percent / 100) * product.quantity)}</p>
                <p className="text-red-600 text-sm mt-1">(-{product.percent}%)</p>
            </div>
            <div className="col-span-2 flex justify-center">
                <div className="flex items-center">
                    <div className="flex border border-gray-300 rounded">
                        <button
                            disabled={product.quantity <= 1}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 text-lg"
                            onClick={() => handleChangeQuantity(index, "decrease")}
                        >
                            −
                        </button>

                        <input
                            type="number"
                            min={1} // bạn có thể thay đổi giá trị min
                            max={product.stock} // bạn có thể tùy chỉnh max theo logic của bạn
                            value={product.quantity}
                            className="w-10 h-10 text-center border-l border-r border-gray-300 outline-none"
                        />

                        <button
                            disabled={product.quantity >= product.stock}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 text-lg"
                            onClick={() => handleChangeQuantity(index, "increase")}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
            <div className="col-span-2 text-right font-bold text-gray-800">
                {formatCurrency(Math.round(product.price * (1 - product.percent / 100)) * product.quantity)}
            </div>
            <div className="col-span-1 flex justify-center">
                <button className="text-gray-500 hover:text-red-600"
                    onClick={() => handleRemoveItem(index)}
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );

    return (
        <>
            <ToastContainer position="top-center" autoClose={2000} pauseOnHover={false} />
            <div className="max-w-6xl mx-auto px-4 py-6 font-sans">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="relative flex items-center justify-between">
                        <div className="absolute w-full top-3 h-0.5 bg-gray-200"></div>
                        <div className="flex justify-between w-full relative">
                            <div className="flex flex-col items-center z-10">
                                <div className="h-6 w-6 rounded-full bg-black"></div>
                                <span className="text-sm mt-2 font-medium text-gray-800">Giỏ hàng</span>
                            </div>
                            <div className="flex flex-col items-center z-10">
                                <div className="h-6 w-6 rounded-full bg-white border border-gray-300"></div>
                                <span className="text-sm mt-2 text-gray-500">Đặt hàng</span>
                            </div>
                            <div className="flex flex-col items-center z-10">
                                <div className="h-6 w-6 rounded-full bg-white border border-gray-300"></div>
                                <span className="text-sm mt-2 text-gray-500">Thanh toán</span>
                            </div>
                            <div className="flex flex-col items-center z-10">
                                <div className="h-6 w-6 rounded-full bg-white border border-gray-300"></div>
                                <span className="text-sm mt-2 text-gray-500">Hoàn thành đơn</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    <div className="flex-grow">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">
                            Giỏ hàng của bạn <span className="text-red-600">{cart.length} Sản Phẩm</span>
                        </h2>

                        {/* Desktop view */}
                        <div className="hidden md:block">
                            <div className="sticky top-0 bg-white z-10 grid grid-cols-12 text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider py-2">
                                <div className="col-span-5">TÊN SẢN PHẨM</div>
                                <div className="col-span-2 text-center">GIẢM GIÁ</div>
                                <div className="col-span-2 text-center">SỐ LƯỢNG</div>
                                <div className="col-span-2 text-right">TỔNG TIỀN</div>
                                <div className="col-span-1"></div>
                            </div>
                            <div className="overflow-y-auto max-h-96">
                                {cart.map((product, index) => (
                                    <DesktopProductRow key={product.id} product={product} index={index} />
                                ))}
                            </div>
                            <div className="mt-14">
                                <Link to={"/"}>
                                    <button className="px-6 py-3 border border-gray-300 rounded flex items-center text-gray-700 hover:bg-gray-50 transition-colors">
                                        <span className="mr-2">←</span> Tiếp tục mua hàng
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Mobile view */}
                        <div className="md:hidden">
                            <div>
                                {cart.map((product, index) => (
                                    <MobileProductCard key={product.id} product={product} index={index} />
                                ))}
                            </div>
                            <div className="mt-8">
                                <button className="w-full px-4 py-3 border border-gray-300 rounded flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors">
                                    <span className="mr-2">←</span> Tiếp tục mua hàng
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order summary */}
                    <div className="w-full lg:w-96 lg:sticky lg:top-8 h-fit mt-6 lg:mt-0">
                        <div className="bg-gray-50 p-4 lg:p-6 rounded-lg border border-gray-100">
                            <h3 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6 text-gray-800">Tổng tiền giỏ hàng</h3>
                            <div className="space-y-3 lg:space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Tổng sản phẩm</span>
                                    <span className="text-gray-800 font-medium">{cart.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Tổng tiền hàng</span>
                                    <span className="text-gray-800 font-medium">{formatCurrency(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 lg:pt-4 border-t border-gray-200">
                                    <span className="font-bold text-gray-800">Thành tiền</span>
                                    <span className="font-bold text-gray-800">{formatCurrency(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Tạm tính</span>
                                    <span className="font-bold text-gray-800">{formatCurrency(totalPrice)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleNavigate}
                                className="w-full bg-black text-white font-bold py-3 rounded-lg mt-6 lg:mt-8 hover:bg-gray-900 transition-colors"
                            >
                                ĐẶT HÀNG
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}