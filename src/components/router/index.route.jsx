import Error from "../../components/error/index.error.jsx";
import ListAccount from "../../view/admin/account/index.account.jsx";
import ListCategory from "../../view/admin/category/index.category.jsx";
import DashboardPage from "../../view/admin/dashboard/index.dashboard";
import CreateProduct from "../../view/admin/product/create.product.jsx";
import AdminProductList from "../../view/admin/product/index.product.jsx";
import UpdateProduct from "../../view/admin/product/update.product.jsx";
import ListRole from "../../view/admin/role/index.role.jsx";
import Permission from "../../view/admin/role/permission.role.jsx";
import Home from "../../view/client/home/index.home.jsx";
import Infor from "../../view/client/user/infor.jsx";
import Register from "../../view/auth/register.jsx"
import AdminRoute from "../auth/admin.auth.jsx";
import Forbidden403 from "../error/unauthorized.error.jsx";
import Layout from "../layout/admin/index.layout";
import Login from "../../view/auth/login.jsx";
import OAuth2Callback from "../../view/auth/OAuth2Callback.jsx";
import LayoutUser from "../../components/layout/client/index.layout.jsx";
import ProductDetail from "../../view/client/product/detail.product.jsx";
import ShoppingCart from "../../view/client/shopping/index.shopping.jsx";
import Payment from "../../view/client/payment/index.payment.jsx";
import PaymentCallback from "../../view/client/payment/callBack.payment.jsx";
import Order from "../../view/client/order/index.order.jsx";
import OrdersAdmin from "../../view/admin/orders/index.orders.jsx";
import Support from "../../view/admin/support/index.support.jsx";

import Favorite from "../../view/client/user/favorite.jsx";

import Forgot from "../../view/auth/forgot.jsx";

import PrivateClient from "../../components/auth/client.auth.jsx";


export const router = [
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path:"/forgot",
        element: <Forgot />

    },
    {
        path: "/",
        element: <LayoutUser />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "detail/:slug",
                element: <ProductDetail />
            },
            {
                path: "shopping-cart",
                element: <ShoppingCart />
            },
            {
                path: "favorite",
                element: <Favorite />
            },
            {
                element: <PrivateClient />,
                children: [
                    {
                        path: "payment",
                        element: <Payment />
                    }, {
                        path: "infor",
                        element: <Infor />
                    },
                    {
                        path: "order",
                        element: <Order />
                    }
                ]
            }
        ]
    },
    {
        path: "/admin",
        element: <AdminRoute />,
        children: [
            {
                element: <Layout />,
                children: [

                    {
                        path: "dashboard",
                        element: <DashboardPage />,
                    },
                    {
                        path: "analytics",
                        element: <h1 className="title">Analytics</h1>,
                    },
                    {
                        path: "reports",
                        element: <h1 className="title">Reports</h1>,
                    },
                    {
                        path: "accounts",
                        element: <ListAccount />
                    },
                    {
                        path: "new-customer",
                        element: <h1 className="title">New Customer</h1>,
                    },
                    {
                        path: "verified-customers",
                        element: <h1 className="title">Verified Customers</h1>,
                    },
                    {
                        path: "products",
                        element: <AdminProductList />
                    },
                    {
                        path: "products/:id",
                        element: <UpdateProduct />
                    },
                    {
                        path: "inventory",
                        element: <h1 className="title">Inventory</h1>,
                    },
                    {
                        path: "roles",
                        element: <ListRole />
                    },
                    {
                        path: "permissions",
                        element: <Permission />
                    },
                    {
                        path: "categories",
                        element: <ListCategory />
                    },
                    {
                        path: "settings",
                        element: <h1 className="title">Settings</h1>,
                    },
                    {
                        path: "new-product",
                        element: <CreateProduct />
                    },
                    {
                        path: "ordersAdmin",
                        element: <OrdersAdmin /> 
                    },
                    {
                        path: "supports",
                        element: <Support/>
                    },
                ]
            },

        ],
    },
    {
        path: "/oauth2/callback/:type",
        element: <OAuth2Callback />
    },
    {
        path: "*",
        element: <Error />
    },
    {
        path: "/payments/callback",
        element: <PaymentCallback />
    },
    {
        path: "/unauthorized",
        element: <Forbidden403 />
    }
];
export default router;