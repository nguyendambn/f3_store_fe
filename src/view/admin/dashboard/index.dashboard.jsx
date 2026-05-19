import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useTheme } from "../../../hooks/use-theme";


import { Footer } from "../../../components/layout/admin/footer/footer.admin";

import { CreditCard, DollarSign, Package, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { thongkeCustomers, thongkeOrder, thongkeProduct, thongkeRecent, thongkeTopOrder, thongkeTotalMonth,xuatBaoCao } from "../../../services/admin/dashboard.jsx";
import { Button } from "antd";

const DashboardPage = () => {
    const { theme } = useTheme();
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [thongkeRecentSales, setThongkeRecentSales] = useState([]);
    const [thongkeTopOrder1, setThongkeTopOrder1] = useState([]);

    const [overviewData, setOverviewData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await thongkeTotalMonth();
            const data = res.data;

            const fullYear = Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                const found = data.find(item => item.month === month);
                return {
                    month, // dùng cho X-Axis
                    total: found ? found.total_month : 0,
                };
            });

            setOverviewData(fullYear);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const tinhTotalProducts = async () => {
            const responseTotalProducts = await thongkeProduct();
            console.log("kq1:", responseTotalProducts);
            setTotalProducts(responseTotalProducts.data);
        }
        tinhTotalProducts();



    }, []);
    useEffect(() => {
        const tinhTotalOrder = async () => {
            const responseTotalOrder = await thongkeOrder();
            console.log("kq2:", responseTotalOrder);
            setTotalOrders(responseTotalOrder.data);
        }
        tinhTotalOrder();



    }, []);

    useEffect(() => {
        const tinhTotalCustomers = async () => {
            const responseTotalCustomers = await thongkeCustomers();
            console.log("kq3:", responseTotalCustomers);
            setTotalCustomers(responseTotalCustomers.data);
        }
        tinhTotalCustomers();



    }, []);

    useEffect(() => {
        const tinhRecentSales = async () => {
            const responseRecentSales = await thongkeRecent();
            console.log("kq4:", responseRecentSales);
            setThongkeRecentSales(responseRecentSales.data);

        }
        tinhRecentSales();



    }, []);


    useEffect(() => {
        const TopOrder = async () => {
            const res = await thongkeTopOrder();
            console.log("kq5:", res);
            setThongkeTopOrder1(res.data);

        }
        TopOrder();



    }, []);
    const excel = async () => {
    try {
        console.log("click_excel");

        const blob = await xuatBaoCao();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "doanh_thu_12_thang.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Xuất Excel lỗi", err);
    }
};











    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Dashboard</h1>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div className="card">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Package size={26} />
                        </div>
                        <p className="card-title">Tổng sản phẩm</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">{totalProducts}</p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <TrendingUp size={18} />
                            25%
                        </span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <DollarSign size={26} />
                        </div>
                        <p className="card-title">Tổng số đơn đã thanh toán</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">{totalOrders}</p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <TrendingUp size={18} />
                            12%
                        </span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Users size={26} />
                        </div>
                        <p className="card-title">Tổng số khách hàng</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">{totalCustomers}</p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <TrendingUp size={18} />
                            15%
                        </span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <CreditCard size={26} />
                        </div>
                        <p className="card-title">Khuyến mãi</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">10</p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <TrendingUp size={18} />
                            19%
                        </span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="card col-span-1 md:col-span-2 lg:col-span-4">
                    <div className="card-header flex justify-between items-center">
                        <p className="card-title">Tổng quan doanh thu</p>
                        <div className="card-actions">
                            <button className="px-4 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700" onClick={excel}>
                                Xuất báo cáo
                            </button>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <ResponsiveContainer width="100%" minWidth={500} height={300}>
                            <AreaChart
                                data={overviewData}
                                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <Tooltip
                                    cursor={false}
                                    formatter={(value) => `${value.toLocaleString()}₫`}
                                    labelFormatter={(label) => `Tháng ${label}`}
                                />

                                {/* Trục X = tháng (số từ 1-12) */}
                                <XAxis
                                    dataKey="month"
                                    interval={0}
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickMargin={6}
                                />

                                {/* Trục Y = total (TotalPrice) */}
                                <YAxis
                                    dataKey="total"
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickFormatter={(value) => `$${value}`}
                                    tickMargin={6}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#2563eb"
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="card col-span-1 md:col-span-2 lg:col-span-3">
                    <div className="card-header">
                        <p className="card-title"> Người mua gần đây</p>
                    </div>
                    <div className="card-body h-[300px] overflow-auto p-0">
                        {thongkeRecentSales.map((sale) => (
                            <div
                                key={sale}
                                className="flex items-center justify-between gap-x-4 py-2 pr-2"
                            >
                                <div className="flex items-center gap-x-4">
                                    <img
                                        src={sale.src}
                                        alt={sale.name}
                                        className="size-10 flex-shrink-0 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col gap-y-2">
                                        <p className="font-medium text-slate-900 dark:text-slate-50">{sale.name}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{sale.email}</p>
                                    </div>
                                </div>
                                <p className="font-medium text-slate-900 dark:text-slate-50">{sale.totalPrice.toLocaleString()}₫</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    <p className="card-title">Sản phẩm bán chạy</p>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head">STT</th>
                                    <th className="table-head">Sản phẩm</th>
                                    <th className="table-head">Giá</th>
                                    <th className="table-head">Lượt mua</th>


                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {Array.isArray(thongkeTopOrder1) && thongkeTopOrder1.map((product, index) => (
                                    <tr key={product.product_id || index} className="table-row">
                                        <td className="table-cell">{index + 1}</td> {/* fix ở đây */}
                                        <td className="table-cell">
                                            <div className="flex w-max gap-x-4">
                                                <img
                                                    src={product.src}
                                                    alt={product.name}
                                                    className="size-14 rounded-lg object-cover"
                                                />
                                                <div className="flex flex-col">
                                                    <p>{product.name}</p>
                                                    <p className="font-normal text-slate-600 dark:text-slate-400">
                                                        {product.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">{product.price.toLocaleString()}₫</td>
                                        <td className="table-cell">{product.sold_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardPage;
