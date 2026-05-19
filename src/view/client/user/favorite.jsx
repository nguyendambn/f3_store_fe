import { Trash2, ShoppingCart } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFavorite, setFavorite } from '../../../components/action/index.action';
import {
    checkFavoriteExist,
    getFavorite,
    updateFavorite,
    addToFavorite
} from '../../../services/Client/user.service';
import { addCart } from '../../../components/action/index.action';
import { toast } from "react-toastify";
import { notification } from "../../../helpers/toast";

function Favorite() {
    const dispatch = useDispatch();
    const products = useSelector(state => state.favorite);

    useEffect(() => {
        const loadFavorites = async () => {
            const local = JSON.parse(localStorage.getItem("favorite"));

            if (local) {
                try {
                    dispatch(setFavorite(local));
                } catch (e) {
                    console.error("Lỗi parse localStorage:", e);
                }
            } else {
                try {
                    const check = await checkFavoriteExist();

                    if (check.data) {
                        const res = await getFavorite();
                        dispatch(setFavorite(res.data));
                        localStorage.setItem("favorite", JSON.stringify(res.data));
                    } else {
                        await addToFavorite();
                    }
                } catch (err) {
                    console.error("Lỗi lấy danh sách yêu thích từ server:", err);
                }
            }
        };

        loadFavorites();
    }, [dispatch]);

    useEffect(() => {
        localStorage.setItem("favorite", JSON.stringify(products));
    }, [products]);

    const handleDelete = async (id, colorId, sizeId) => {
        const newList = products.filter(
            p => !(p.id === id && p.color.id === colorId && p.size.id === sizeId)
        );

        dispatch(removeFavorite({
            id,
            color: { id: colorId },
            size: { id: sizeId }
        }));

        try {
            await updateFavorite(newList);
        } catch (error) {
            console.error("Lỗi cập nhật danh sách yêu thích:", error);
        }
    };

    const handleAddToCart = async (product) => {
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            percent: product.percent,
            image: {
                id: product.image.id,
                src: product.image.src,
            },
            color: {
                id: product.color.id,
                name: product.color.name,
                hex: product.color.hex
            },
            size: {
                id: product.size.id,
                name: product.size.name
            },
            stock: product.stock,
            quantity: 1
        };

        dispatch(addCart(cartItem));

        notification(
            toast,
            "Thêm sản phẩm vào giỏ hàng thành công",
            "success"
        );
    };

    return (
        <div className="w-full px-4">
            <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-xl">
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                                <th className="px-4 py-4 text-center text-sm font-bold uppercase tracking-wide">
                                    STT
                                </th>
                                <th className="px-4 py-4 text-center text-sm font-bold uppercase tracking-wide">
                                    Hình ảnh
                                </th>
                                <th className="px-4 py-4 text-center text-sm font-bold uppercase tracking-wide">
                                    Tên sản phẩm
                                </th>
                                <th className="px-4 py-4 text-center text-sm font-bold uppercase tracking-wide">
                                    Size
                                </th>
                                <th className="px-4 py-4 text-center text-sm font-bold uppercase tracking-wide">
                                    Màu sắc
                                </th>
                                <th className="px-4 py-4 text-center text-sm font-bold uppercase tracking-wide">
                                    Giá
                                </th>
                                <th className="px-4 py-4 text-center text-sm font-bold uppercase tracking-wide">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-pink-50">
                            {products.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-4 py-12 text-center text-lg text-gray-500"
                                    >
                                        Không có sản phẩm yêu thích nào.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product, index) => (
                                    <tr
                                        key={`${product.id}-${product.color.id}-${product.size.id}`}
                                        className="border-b border-pink-100 transition hover:bg-white"
                                    >
                                        <td className="px-4 py-5 text-center align-middle font-semibold text-gray-700">
                                            {index + 1}
                                        </td>

                                        <td className="px-4 py-5 text-center align-middle">
                                            <img
                                                src={product.image?.src}
                                                alt={product.name}
                                                className="mx-auto h-16 w-16 rounded-xl object-cover shadow-sm"
                                            />
                                        </td>

                                        <td className="px-4 py-5 text-center align-middle font-semibold text-gray-800">
                                            {product.name}
                                        </td>

                                        <td className="px-4 py-5 text-center align-middle">
                                            <span className="inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-purple-600">
                                                {product.size?.name}
                                            </span>
                                        </td>

                                        <td className="px-4 py-5 text-center align-middle">
                                            <div className="flex items-center justify-center gap-2">
                                                <span
                                                    className="h-5 w-5 rounded-full border border-gray-200 shadow-sm"
                                                    style={{
                                                        backgroundColor:
                                                            product.color?.hex ||
                                                            product.color?.code
                                                    }}
                                                ></span>

                                                <span className="font-medium text-gray-700">
                                                    {product.color?.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-5 text-center align-middle text-lg font-bold text-red-500">
                                            {product.price} ₫
                                        </td>

                                        <td className="px-4 py-5 text-center align-middle">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-green-500 text-green-600 transition hover:bg-green-500 hover:text-white"
                                                    title="Thêm vào giỏ hàng"
                                                >
                                                    <ShoppingCart size={16} />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            product.id,
                                                            product.color.id,
                                                            product.size.id
                                                        )
                                                    }
                                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500 text-red-600 transition hover:bg-red-500 hover:text-white"
                                                    title="Xóa khỏi danh sách yêu thích"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Favorite;