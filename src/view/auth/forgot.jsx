import { useState } from 'react';
import { OTPRequest } from '../../services/Client/user.service'; 
import { checkOTP } from '../../services/Client/user.service';
import { resetPassword } from '../../services/Client/user.service';
const Forgot = () => {
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [otp1, setOtp1] = useState(['', '', '', '', '', '']);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleNhanMaOTP = async() => {
        if (!email) {
            alert("Vui lòng nhập email trước khi nhận mã OTP");
            return;
        }
        const request = await OTPRequest(email);
        console.log("request:", request);
        alert("Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến.");
        setShowOTPModal(true);
    };

    const handleOTPChange = (index, value) => {
        if (value.length > 1) return; // Chỉ cho phép 1 ký tự
        if (!/^\d*$/.test(value)) return; // Chỉ cho phép số

        const newOTP = [...otp1];
        newOTP[index] = value;
        setOtp1(newOTP);

        // Tự động focus vào ô tiếp theo
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp1-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOTPKeyDown = (index, e) => {
        // Xử lý phím Backspace
        if (e.key === 'Backspace' && !otp1[index] && index > 0) {
            const prevInput = document.getElementById(`otp1-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleXacNhanOTP = async() => {
        const otp = otp1.join('');
        if (otp.length !== 6) {
            alert("Vui lòng nhập đầy đủ 6 số mã OTP");
            return;
        }
        
        console.log("mã otp:", otp);
        const check = await checkOTP(email, otp);
        console.log("checkOTP:", check);
        
        if (check.status === 200) {
            setShowOTPModal(false);
            setShowPasswordModal(true);
            setOtp1(['', '', '', '', '', '']);
        } else {
            alert("Mã OTP không chính xác. Vui lòng thử lại.");
        }
    };

    const closeModal = () => {
        setShowOTPModal(false);
        setOtp1(['', '', '', '', '', '']);
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setNewPassword('');
        setConfirmPassword('');
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            alert("Vui lòng nhập đầy đủ thông tin mật khẩu");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp");
            return;
        }

        if (newPassword.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        try {
           const reset = await resetPassword(email, newPassword);
           console.log("reset:", reset);
            
            console.log("Đặt lại mật khẩu cho email:", email);
            console.log("Mật khẩu mới:", newPassword);
            
            alert("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.");
            closePasswordModal();
            // Chuyển hướng về trang đăng nhập
             window.location.href = '/login';
        } catch (error) {
            console.error("Lỗi đặt lại mật khẩu:", error);
            alert("Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại.");
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Quên mật khẩu
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Nhập email để nhận mã OTP khôi phục mật khẩu
                        </p>
                    </div>
                    <div className="mt-8 space-y-6">
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Vui lòng nhập email của bạn
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="example@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={handleNhanMaOTP}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                            >
                                Nhận mã OTP
                            </button>
                        </div>

                        <div className="text-center">
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                Quay lại đăng nhập
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            {showOTPModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Nhập mã OTP
                            </h3>
                            <p className="text-sm text-gray-600">
                                Mã OTP đã được gửi đến email: {email}
                            </p>
                        </div>

                        <div className="flex justify-center space-x-2 mb-6">
                            {otp1.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp1-${index}`}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOTPChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                                    className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            ))}
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={closeModal}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleXacNhanOTP}
                                className="flex-1 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                            >
                                Xác nhận
                            </button>
                        </div>

                        <div className="mt-4 text-center">
                            <button
                                onClick={handleNhanMaOTP}
                                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                            >
                                Gửi lại mã OTP
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Reset Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Đặt lại mật khẩu
                            </h3>
                            <p className="text-sm text-gray-600">
                                Nhập mật khẩu mới cho tài khoản: {email}
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mật khẩu mới
                                </label>
                                <div className="relative">
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                        placeholder="Nhập mật khẩu mới"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showNewPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                        placeholder="Nhập lại mật khẩu mới"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500">
                                <p>• Mật khẩu phải có ít nhất 6 ký tự</p>
                                <p>• Nên bao gồm chữ hoa, chữ thường và số</p>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={closePasswordModal}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleResetPassword}
                                className="flex-1 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                            >
                                Đặt lại mật khẩu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Forgot;