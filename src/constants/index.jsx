import { Boxes, ChartColumn, CirclePlus, Folder, Home, KeyRound, NotepadText, Package, PackagePlus, Settings, ShieldCheck, ShoppingBag, UserCheck, UserPlus, Users, HelpCircle } from "lucide-react";
import {config} from "../config/index.config";
import ProfileImage from "@/assets/profile-image.jpg";
import ProductImage from "@/assets/product-image.jpg";

export const prefixAdmin = "api/admin";
export const prefixUser = "api";

export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Dashboard",
                icon: Home,
                path: `${config.prefixAdmin}/dashboard`,
            },
            
            
        ],
    },
    {
        title: "Tài khoản",
        links: [
            {
                label: "Tài khoản",
                icon: Users,
                path: `${config.prefixAdmin}/accounts`,
            }
        ],
    },
    {
        title: "Danh mục",
        links: [
            {
                label: "Danh mục sản phẩm",
                icon: Folder,
                path: `${config.prefixAdmin}/categories`,
            }
        ],
    },
    {
        title: "Đơn",
        links: [
            {
                label: "Đơn đặt hàng",
                icon: ShoppingBag,
                path: `${config.prefixAdmin}/ordersAdmin`,
            }
        ],
    },
    {
        title: "Sản phẩm",
        links: [
            {
                label: "Sản phẩm",
                icon: Package,
                path: `${config.prefixAdmin}/products`,
            },
            {
                label: "Thêm sản phẩm",
                icon: CirclePlus,
                path: `${config.prefixAdmin}/new-product`,
            }
        ],
    },
    
    {
        title: "Vai trò",
        links: [
            {
                label: "Vai trò",
                icon: ShieldCheck,
                path: `${config.prefixAdmin}/roles`,
            },
            {
                label: "Phân quyền",
                icon: KeyRound,
                path:  `${config.prefixAdmin}/permissions`,
            }
        ],
    },
    {
        title: "Cài đặt",
        links: [
            {
                label: "Cài đặt",
                icon: Settings,
                path: "/settings",
            },
        ],
    },
    {
        title: "Hỗ trợ",
        links: [
            {
                label: "Hỗ trợ",
                icon: HelpCircle,
                path: `${config.prefixAdmin}/supports`,
            },
        ],
    },
];


// export const overviewData = [
//     {
//         name: "Jan",
//         total: 1500,
//     },
//     {
//         name: "Feb",
//         total: 2000,
//     },
//     {
//         name: "Mar",
//         total: 1000,
//     },
//     {
//         name: "Apr",
//         total: 5000,
//     },
//     {
//         name: "May",
//         total: 2000,
//     },
//     {
//         name: "Jun",
//         total: 5900,
//     },
//     {
//         name: "Jul",
//         total: 2000,
//     },
//     {
//         name: "Aug",
//         total: 5500,
//     },
//     {
//         name: "Sep",
//         total: 2000,
//     },
//     {
//         name: "Oct",
//         total: 4000,
//     },
//     {
//         name: "Nov",
//         total: 1500,
//     },
//     {
//         name: "Dec",
//         total: 2500,
//     },
// ];

export const recentSalesData = [
    {
        id: 1,
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        image: ProfileImage,
        total: 1500,
    },
    {
        id: 2,
        name: "James Smith",
        email: "james.smith@email.com",
        image: ProfileImage,
        total: 2000,
    },
    {
        id: 3,
        name: "Sophia Brown",
        email: "sophia.brown@email.com",
        image: ProfileImage,
        total: 4000,
    },
    {
        id: 4,
        name: "Noah Wilson",
        email: "noah.wilson@email.com",
        image: ProfileImage,
        total: 3000,
    },
    {
        id: 5,
        name: "Emma Jones",
        email: "emma.jones@email.com",
        image: ProfileImage,
        total: 2500,
    },
    {
        id: 6,
        name: "William Taylor",
        email: "william.taylor@email.com",
        image: ProfileImage,
        total: 4500,
    },
    {
        id: 7,
        name: "Isabella Johnson",
        email: "isabella.johnson@email.com",
        image: ProfileImage,
        total: 5300,
    },
];

export const topProducts = [
    {
        number: 1,
        name: "Wireless Headphones",
        image: ProductImage,
        description: "High-quality noise-canceling wireless headphones.",
        price: 99.99,
        status: "In Stock",
        rating: 4.5,
    },
    {
        number: 2,
        name: "Smartphone",
        image: ProductImage,
        description: "Latest 5G smartphone with excellent camera features.",
        price: 799.99,
        status: "In Stock",
        rating: 4.7,
    },
    {
        number: 3,
        name: "Gaming Laptop",
        image: ProductImage,
        description: "Powerful gaming laptop with high-end graphics.",
        price: 1299.99,
        status: "In Stock",
        rating: 4.8,
    },
    {
        number: 4,
        name: "Smartwatch",
        image: ProductImage,
        description: "Stylish smartwatch with fitness tracking features.",
        price: 199.99,
        status: "Out of Stock",
        rating: 4.4,
    },
    {
        number: 5,
        name: "Bluetooth Speaker",
        image: ProductImage,
        description: "Portable Bluetooth speaker with deep bass sound.",
        price: 59.99,
        status: "In Stock",
        rating: 4.3,
    },
    {
        number: 6,
        name: "4K Monitor",
        image: ProductImage,
        description: "Ultra HD 4K monitor with stunning color accuracy.",
        price: 399.99,
        status: "In Stock",
        rating: 4.6,
    },
    {
        number: 7,
        name: "Mechanical Keyboard",
        image: ProductImage,
        description: "Mechanical keyboard with customizable RGB lighting.",
        price: 89.99,
        status: "In Stock",
        rating: 4.7,
    },
    {
        number: 8,
        name: "Wireless Mouse",
        image: ProductImage,
        description: "Ergonomic wireless mouse with precision tracking.",
        price: 49.99,
        status: "In Stock",
        rating: 4.5,
    },
    {
        number: 9,
        name: "Action Camera",
        image: ProductImage,
        description: "Waterproof action camera with 4K video recording.",
        price: 249.99,
        status: "In Stock",
        rating: 4.8,
    },
    {
        number: 10,
        name: "External Hard Drive",
        image: ProductImage,
        description: "Portable 2TB external hard drive for data storage.",
        price: 79.99,
        status: "Out of Stock",
        rating: 4.5,
    },
];


const mockProducts = [
    {
      product_id: 1,
      name: "Áo thun thể thao",
      image: "http://res.cloudinary.com/dxx1lgamz/image/upload/4b3fb84e-760e-4a22-902f-47a64e924f3d_anh6",
      category: "Thời trang nam",
      price: 250000,
      discount: 10,
      stock: 50,
      sold_count: 20,
      deleted: false,
      promotions: [
        {
          percent: 10,
          start_date: "2024-04-01",
          end_date: "2024-04-20",
        },
        {
          percent: 5,
          start_date: "2024-03-01",
          end_date: "2024-03-10",
        },
      ],
    },
    {
      product_id: 1,
      name: "Áo thun thể thao",
      image: "http://res.cloudinary.com/dxx1lgamz/image/upload/4b3fb84e-760e-4a22-902f-47a64e924f3d_anh6",
      category: "Thời trang nam",
      price: 250000,
      discount: 10,
      stock: 50,
      sold_count: 20,
      deleted: false,
      promotions: [
        {
          percent: 10,
          start_date: "2024-04-01",
          end_date: "2024-04-20",
        },
        {
          percent: 5,
          start_date: "2024-03-01",
          end_date: "2024-03-10",
        },
      ],
    },
    {
      product_id: 1,
      name: "Áo thun thể thao",
      image: "http://res.cloudinary.com/dxx1lgamz/image/upload/4b3fb84e-760e-4a22-902f-47a64e924f3d_anh6",
      category: "Thời trang nam",
      price: 250000,
      discount: 10,
      stock: 50,
      sold_count: 20,
      deleted: false,
      promotions: [
        {
          percent: 10,
          start_date: "2024-04-01",
          end_date: "2024-04-20",
        },
        {
          percent: 5,
          start_date: "2024-03-01",
          end_date: "2024-03-10",
        },
      ],
    }
  ];
  
  export default mockProducts;