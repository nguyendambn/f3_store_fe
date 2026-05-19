import { faHome, faMapMarkerAlt, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { createAddress } from "../../../services/Client/address.service";
import { getProfile } from "../../../services/auth/auth.service";
import { useDispatch } from 'react-redux';
import { infor as profile } from "../../../components/action/index.action";
import { notification } from '../../../helpers/toast';
import { toast } from 'react-toastify';

function AddressModal({ showModal, setShowModal }) {
    const dispatch = useDispatch();
    const [addressData, setAddressData] = useState({
        cityId: '',
        districtId: '',
        wardId: '',
        detail: '',
        isDefault: false
    });

    const [city, setCity] = useState([]);
    const [district, setDistrict] = useState([]);
    const [ward, setWard] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch("https://provinces.open-api.vn/api/");
                const cityList = await response.json();
                setCity(cityList);
            } catch (error) {
                console.error("Không thể tải danh sách thành phố!", error);
            }
        };
        fetchCities();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddressData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCityChange = async (e) => {
        const cityCode = e.target.value;


        setAddressData(prev => ({
            ...prev,
            cityId: cityCode,
            districtId: '',
            wardId: ''
        }));

        setDistrict([]);
        setWard([]);

        if (cityCode) {
            try {
                const res = await fetch(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`);
                const data = await res.json();
                setDistrict(data.districts || []);
            } catch (error) {
                console.error("Không thể tải danh sách quận/huyện!", error);
            }
        }
    };

    const handleDistrictChange = async (e) => {
        const districtCode = e.target.value;


        setAddressData(prev => ({
            ...prev,
            districtId: districtCode,
            wardId: ''
        }));

        setWard([]);

        if (districtCode) {
            try {
                const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
                const data = await res.json();
                setWard(data.wards || []);
            } catch (error) {
                console.error("Không thể tải danh sách phường/xã!", error);
            }
        }
    };

    const handleWardChange = (e) => {
        const wardCode = e.target.value;


        setAddressData(prev => ({
            ...prev,
            wardId: wardCode,
        }));
    };

    const resetForm = () => {
        setAddressData({
            cityId: '',
            districtId: '',
            wardId: '',
            detail: '',
            isDefault: false
        });
        setDistrict([]);
        setWard([]);
    };

    const handleSubmit = async () => {
        if(Object.values(addressData).some(value => String(value).trim() === "")){
            notification(toast, "Vui lòng nhập đủ thông tin");
            return;
        }
        const res = await createAddress(addressData);
        if (res.status == 200) {
            const infor = await getProfile();
            if (infor.status == 200) {
                localStorage.setItem("profile", JSON.stringify(infor.data.result));
                dispatch(profile(infor.data.result));
                handleCloseModal();
            }
        }
    }

    const handleCloseModal = () => {
        setLoading(false);
        setShowModal(false);
        resetForm();
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Thêm địa chỉ mới</h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} size="lg" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-4">
                            {/* Thành phố */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tỉnh/Thành phố
                                </label>
                                <select
                                    name="cityId"
                                    value={addressData.cityId}
                                    onChange={handleCityChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    required
                                >
                                    <option value="">Chọn tỉnh/thành phố</option>
                                    {city.map(item => (
                                        <option key={item.code} value={item.code}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quận/Huyện */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quận/Huyện
                                </label>
                                <select
                                    name="districtId"
                                    value={addressData.districtId}
                                    onChange={handleDistrictChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    disabled={!addressData.cityId}
                                    required
                                >
                                    <option value="">Chọn quận/huyện</option>
                                    {district.map(item => (
                                        <option key={item.code} value={item.code}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Phường/Xã */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phường/Xã
                                </label>
                                <select
                                    name="wardId"
                                    value={addressData.wardId}
                                    onChange={handleWardChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    disabled={!addressData.districtId}
                                    required
                                >
                                    <option value="">Chọn phường/xã</option>
                                    {ward.map(item => (
                                        <option key={item.code} value={item.code}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Địa chỉ cụ thể */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Địa chỉ cụ thể
                                </label>
                                <textarea
                                    name="detail"
                                    value={addressData.specificAddress}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                                    placeholder="Nhập số nhà, tên đường..."
                                    required
                                />
                            </div>

                            {/* Checkbox địa chỉ mặc định */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    id="isDefault"
                                    checked={addressData.isDefault}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                                    Đặt làm địa chỉ mặc định
                                </label>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={loading}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                {loading && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                                {loading ? 'Đang lưu...' : 'Lưu địa chỉ'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddressModal;