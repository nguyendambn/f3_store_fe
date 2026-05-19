import { ArrowRight, CreditCard, Facebook, Heart, Instagram, Mail, MapPin, Phone, ShieldCheck, Truck, Twitter, Youtube } from 'lucide-react';
import { useState } from 'react';

const Footer = () => {

  return (
    <footer className="bg-white text-gray-800">

      {/* Main Footer */}
      <div className="max-w-[90%] mx-auto py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Về chúng tôi */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">F3 STORE</h2>
              <Heart className="h-5 w-5 text-pink-500 ml-1" fill="#ec4899" />
            </div>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">Thời trang phong cách, chất lượng hàng đầu. Chúng tôi mang đến những sản phẩm tốt nhất với giá cả phải chăng và trải nghiệm mua sắm tuyệt vời.</p>
            <div className="flex space-x-4 mb-8">
              <a href="/" className="bg-gray-100 hover:bg-blue-600 hover:text-white transition-all p-3 rounded-full text-gray-700">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="/" className="bg-gray-100 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white transition-all p-3 rounded-full text-gray-700">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="/" className="bg-gray-100 hover:bg-blue-400 hover:text-white transition-all p-3 rounded-full text-gray-700">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="/" className="bg-gray-100 hover:bg-red-600 hover:text-white transition-all p-3 rounded-full text-gray-700">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Về F3 */}
          <div>
            <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">Về F3 STORE</h2>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-600 hover:text-blue-600 transition flex items-center group">
                <ArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2 text-blue-500" />
                Giới thiệu
              </a></li>
              <li><a href="/" className="text-gray-600 hover:text-blue-600 transition flex items-center group">
                <ArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2 text-blue-500" />
                Tầm nhìn & Sứ mệnh
              </a></li>
              <li><a href="/" className="text-gray-600 hover:text-blue-600 transition flex items-center group">
                <ArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2 text-blue-500" />
                Đội ngũ
              </a></li>
              <li><a href="/" className="text-gray-600 hover:text-blue-600 transition flex items-center group">
                <ArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2 text-blue-500" />
                Tuyển dụng
              </a></li>
              <li><a href="/" className="text-gray-600 hover:text-blue-600 transition flex items-center group">
                <ArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2 text-blue-500" />
                Truyền thông nói về chúng tôi
              </a></li>
            </ul>
          </div>


          {/* Thông tin hỗ trợ */}
          <div>
            <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">Hỗ trợ</h2>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-600 hover:text-blue-600 transition flex items-center group"><ArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2 text-blue-500" />Câu hỏi thường gặp</a></li>
              <li><a href="/" className="text-gray-600 hover:text-blue-600 transition flex items-center group"><ArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2 text-blue-500" />Chính sách vận chuyển</a></li>
              <li><a href="/" className="text-gray-600 hover:text-blue-600 transition flex items-center group"><ArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2 text-blue-500" />Chính sách đổi trả</a></li>
              <li><a href="/" className="text-gray-600 hover:text-blue-600 transition flex items-center group"><ArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2 text-blue-500" />Chính sách bảo mật</a></li>
              <li><a href="/" className="text-gray-600 hover:text-blue-600 transition flex items-center group"><ArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2 text-blue-500" />Điều khoản dịch vụ</a></li>
              <li><a href="/" className="text-gray-600 hover:text-blue-600 transition flex items-center group"><ArrowRight className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2 text-blue-500" />Liên hệ</a></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">Liên hệ</h2>
            <ul className="space-y-5 mb-6">
              <li className="flex items-start">
                <MapPin className="h-6 w-6 mr-3 text-blue-600 flex-shrink-0 mt-1" />
                <span className="text-gray-600 hover:text-gray-900 transition cursor-pointer">132 Cầu Diễn, Minh Khai, Hà Nội</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-6 w-6 mr-3 text-blue-600" />
                <span className="text-gray-600 hover:text-gray-900 transition cursor-pointer">0352 110 400</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-6 w-6 mr-3 text-blue-600 flex-shrink-0 mt-1" />
                <span className="text-gray-600 hover:text-gray-900 transition cursor-pointer">F3store@support.com</span>
              </li>
            </ul>

            <h3 className="font-semibold text-lg mb-3">Giờ làm việc</h3>
            <p className="text-gray-600 mb-1">Thứ 2 - Thứ 6: 8:00 - 20:00</p>
            <p className="text-gray-600">Thứ 7 - Chủ Nhật: 10:00 - 22:00</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;