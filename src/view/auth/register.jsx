import { faCircleMinus, faClipboardCheck, faEnvelope, faEye, faEyeSlash, faImage, faLock, faPhone, faUser, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { delete_preview, preview } from "../../helpers/preview_avatar";
import { useEffect, useState } from "react";
import { sendEmail, register } from "../../services/Client/user.service";
import { ToastContainer, toast } from 'react-toastify';
import { notification } from "../../helpers/toast";
import { useNavigate } from "react-router-dom";

function Register() {
    const [showPass, setShowPass] = useState(false);
    const [dataForm, setDataForm] = useState({});
    const [fileUpload, setFileUpload] = useState(null);
    const [city, setCity] = useState([]);
    const [district, setDistrict] = useState([]);
    const [ward, setWard] = useState([]);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChangeAvatar = (e) => {
        preview(e);
        setFileUpload(e.target.files[0]);
    };

    const handleDeletePreview = () => {
        delete_preview();
        setFileUpload(null);
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const response = await fetch("https://provinces.open-api.vn/api/");
                const cityList = await response.json();
                setCity(cityList);
            } catch (error) {
                notification(toast, "Không thể tải danh sách thành phố!");
            }
        };
        fetchApi();
    }, []);

    const handleChange = (e) => {
        const key = e.target.name;
        const value = e.target.value;
        setDataForm({
            ...dataForm,
            [key]: value
        });
    };

    const handleChangeCity = async (e) => {
        const cityCode = e.target.value;
        handleChange(e);

        setDistrict([]);
        
        setWard([]);
        setDataForm((prev) => {
            const newDataForm = { ...prev };
            delete newDataForm.districtId;
            delete newDataForm.wardId;
            return newDataForm;
        });

        try {
            const res = await fetch(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`);
            const data = await res.json();
            setDistrict(data.districts);
        } catch (error) {
            notification(toast, "Không thể tải danh sách quận/huyện!");
        }
    };

    const handleChangeDistrict = async (e) => {
        const districtCode = e.target.value;
        handleChange(e);
        setWard([]);
        setDataForm((prev) => {
            const newDataForm = { ...prev };
            delete newDataForm.wardId;
            return newDataForm;
        });
        try {
            const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            const data = await res.json();
            setWard(data.wards);
        } catch (error) {
            notification(toast, "Không thể tải danh sách phường/xã!");
        }
    };

    const handleSendMail = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        const patternEmail = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.(com|vn)$/;
        const patternPassword = /(?=.*\d)(?=.*\W)(?=.*[A-Z]).{8,}/;
        const patternPhone = /^0[0-9]{9}$/;
        e.preventDefault();
        if (!dataForm?.name?.trim()) {
            notification(toast, "Vui lòng nhập họ và tên!");
        } else if (!patternPhone.test(dataForm.phone)) {
            notification(toast, "Số điện thoại không đúng định dạng!");
        } else if (!patternEmail.test(dataForm.email)) {
            notification(toast, "Email không đúng định dạng!");
        } else if (!patternPassword.test(dataForm.password)) {
            notification(toast, "Mật khẩu tối thiểu 8 ký tự (ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt)!");
        } else if (dataForm.password !== dataForm.confirmPassword) {
            notification(toast, "Vui lòng xác nhận lại mật khẩu!");
        } else if (!fileUpload) {
            notification(toast, "Vui lòng chọn ảnh đại diện!");
        } else if (!dataForm.cityId || !dataForm.districtId || !dataForm.wardId || !dataForm.detail) {
            notification(toast, "Vui lòng cung cấp địa chỉ!");
        } else {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("avatar", fileUpload);
            for (const item in dataForm) {
                formData.append(item, dataForm[item]);
            }

            try {
                const res = await sendEmail(formData);
                if (res.status === 200) {
                    setShowOtpModal(true);
                    notification(toast, "Đã gửi OTP, vui lòng kiểm tra email!", "success");
                } else {
                    notification(toast, "Email đã tồn tại hoặc gửi email thất bại!");
                }
            } catch (error) {
                notification(toast, "Đã có lỗi xảy ra khi gửi email!");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleVerify = async () => {
        if (isSubmitting) return;
        if (!otp || otp.length !== 6) {
            notification(toast, "Vui lòng nhập mã OTP hợp lệ (6 chữ số)!");
            return;
        }
        setIsSubmitting(true);
        try {
            const email = dataForm.email || "a@gmail.com";
            const res = await register({ email, otp });
            if (res.status === 200) {
                notification(toast, "Đăng ký thành công!", "success");
                setOtp("");
                setShowOtpModal(false);
                navigate("/login");
            } else {
                notification(toast, "Xác thực OTP thất bại!");
            }
        } catch (error) {
            notification(toast, "Đã có lỗi xảy ra khi xác thực!");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <>
            <ToastContainer position="top-center" autoClose={5000} pauseOnHover={false} />
            <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-third via-four to-five font-poppins">
                <form
                    className="w-full max-w-4xl mx-auto max-h-[600px] overflow-y-auto bg-white shadow-lg rounded-lg border border-gray-200 relative"
                    onSubmit={handleSendMail}
                >
                    <div className="sticky top-0 z-50 bg-white">
                        <h1 className="text-2xl font-bold text-gray-800 text-center py-3 px-6">Đăng ký tài khoản</h1>
                        <div className="absolute top-0 right-0 h-full w-4 bg-white"></div>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Left Column: Personal Info */}
                            <div className="space-y-4">
                                {/* Full name */}
                                <div className="space-y-2">
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Họ và tên</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="name"
                                            className="w-full px-4 py-2 pl-10 border rounded-md focus:ring-primary focus:ring-2 focus:outline-none"
                                            placeholder="Nhập họ tên"
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        />
                                        <span className="absolute left-4 top-[50%] translate-y-[-50%]">
                                            <FontAwesomeIcon icon={faUser} />
                                        </span>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            id="phone"
                                            name="phone"
                                            className="w-full px-4 pl-10 py-2 border rounded-md focus:ring-primary focus:ring-2 focus:outline-none"
                                            placeholder="Nhập số điện thoại"
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        />
                                        <span className="absolute left-4 top-[50%] translate-y-[-50%]">
                                            <FontAwesomeIcon icon={faPhone} />
                                        </span>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-primary focus:ring-2 focus:outline-none"
                                            placeholder="Nhập email"
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        />
                                        <span className="absolute left-4 top-[50%] translate-y-[-50%]">
                                            <FontAwesomeIcon icon={faEnvelope} />
                                        </span>
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-[50%] translate-y-[-50%]">
                                            <FontAwesomeIcon icon={faLock} />
                                        </span>
                                        <input
                                            type={showPass ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            className="w-full pl-10 pr-10 px-4 py-2 border rounded-md focus:ring-primary focus:ring-2 focus:outline-none"
                                            placeholder="Nhập mật khẩu"
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        />
                                        <span
                                            className="absolute right-4 top-[50%] translate-y-[-50%]"
                                            onClick={() => setShowPass(!showPass)}
                                        >
                                            <FontAwesomeIcon icon={showPass ? faEye : faEyeSlash} className="cursor-pointer" />
                                        </span>
                                    </div>
                                </div>

                                {/* Confirm password */}
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            className="w-full px-4 pl-10 py-2 border rounded-md focus:ring-primary focus:ring-2 focus:outline-none"
                                            placeholder="Nhập lại mật khẩu..."
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        />
                                        <span className="absolute left-4 top-[50%] translate-y-[-50%]">
                                            <FontAwesomeIcon icon={faClipboardCheck} />
                                        </span>
                                    </div>
                                </div>

                                {/* Avatar upload */}
                                <div className="space-y-2">
                                    <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
                                    <div className="mt-1 flex justify-center p-1 w-full items-center border-2 border-gray-300 border-dashed rounded-md h-[100px]">
                                        <div className="space-y-1 text-center" id="preview_text">
                                            <div className="w-[40px] h-[40px] mx-auto opacity-55">
                                                <FontAwesomeIcon icon={faImage} className="w-full h-full" />
                                            </div>
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="avatar"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                                                >
                                                    <span>Tải lên ảnh</span>
                                                    <input
                                                        id="avatar"
                                                        name="avatar"
                                                        type="file"
                                                        className="sr-only"
                                                        onChange={handleChangeAvatar}
                                                        accept=".png, .jpg"
                                                        disabled={isSubmitting}
                                                    />
                                                </label>
                                                <p className="pl-1">hoặc kéo và thả</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG tối đa 10MB</p>
                                        </div>
                                        <div className="w-full h-full relative hidden" id="preview_avatar">
                                            <img className="w-full h-full object-contain" alt="avatar" />
                                            <FontAwesomeIcon
                                                icon={faCircleMinus}
                                                className="absolute top-0 right-0 hover:text-red-500 cursor-pointer opacity-15 hover:opacity-100"
                                                id="delete_icon"
                                                onClick={handleDeletePreview}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Address Info */}
                            <div className="space-y-4">
                                {/* City select */}
                                <div className="space-y-2">
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
                                    <select
                                        name="cityId"
                                        id="city"
                                        onChange={handleChangeCity}
                                        className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:ring-2 focus:outline-none"
                                        disabled={isSubmitting}
                                    >
                                        <option value="" disabled selected>-- Chọn thành phố --</option>
                                        {city.map((item, index) => (
                                            <option key={index} value={item.code}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* District select */}
                                <div className="space-y-2">
                                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">Quận/Huyện</label>
                                    <select
                                        name="districtId"
                                        id="district"
                                        onChange={handleChangeDistrict}
                                        className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:ring-2 focus:outline-none"
                                        disabled={isSubmitting}
                                    >
                                        <option value="" selected>-- Chọn Quận/Huyện --</option>
                                        {district.map((item, index) => (
                                            <option key={index} value={item.code}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Ward select */}
                                <div className="space-y-2">
                                    <label htmlFor="ward" className="block text-sm font-medium text-gray-700">Phường/Xã</label>
                                    <select
                                        name="wardId"
                                        id="ward"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:ring-2 focus:outline-none"
                                        disabled={isSubmitting}
                                    >
                                        <option value="" selected>-- Chọn Phường/Xã --</option>
                                        {ward.map((item, index) => (
                                            <option key={index} value={item.code}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Detail address */}
                                <div className="space-y-2">
                                    <label htmlFor="detailAddress" className="block text-sm font-medium text-gray-700">Chi tiết địa chỉ</label>
                                    <input
                                        type="text"
                                        id="detailAddress"
                                        name="detail"
                                        className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:ring-2 focus:outline-none"
                                        placeholder="Tên đường, Tòa nhà, Số nhà."
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button with Spinner */}
                        <button
                            type="submit"
                            className={`w-full mt-6 px-4 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center ${isSubmitting ? "opacity-75 cursor-not-allowed" : "hover:brightness-110"
                                }`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                     Đăng ký ngay
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
            {showOtpModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Xác thực OTP</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Vui lòng nhập mã OTP được gửi đến <strong>{dataForm.email || "email của bạn"}</strong>
                        </p>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:ring-2 focus:outline-none mb-4"
                            placeholder="Nhập mã OTP (6 chữ số)"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            disabled={isSubmitting}
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                onClick={() => setShowOtpModal(false)}
                                disabled={isSubmitting}
                            >
                                Hủy
                            </button>
                            <button
                                className={`px-4 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center ${isSubmitting ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-600"
                                    }`}
                                onClick={handleVerify}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                                        Đang xác thực...
                                    </>
                                ) : (
                                    "Xác thực"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Register;