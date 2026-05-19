import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProfile } from "../../../services/auth/auth.service";
import { Edit3, User, Mail, Phone, MapPin, X, Save, Camera, Check } from 'lucide-react';
import { updateInfor } from "../../../services/Client/user.service";
import { convertImg } from "../../../services/Client/user.service";
function Infor() {
  const [url, setUrl] = useState("");
  const [infor, setInfor] = useState(null);
  const [addressData, setAddressData] = useState([]);
  const [editModals, setEditModals] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
    avatar: false
  });
  const [tempData, setTempData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      detail: "",
      cityId: "",
      districtId: "",
      wardId: "",
      index: 0
    }
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
 const onFileChange = (e) => {
  console.log("onFileChange gọi rồi nha!");
  if (e.target.files.length > 0) {
    const file = e.target.files[0];
    setAvatarFile(file);
    console.log("Avatar file selected:", file);

    // Tạo URL preview tạm thời
    const reader = new FileReader();
    reader.onload = (event) => {
      setUrl(event.target.result); // cập nhật ảnh preview trên UI ngay khi chọn
    };
    reader.readAsDataURL(file);
  }
};
  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      alert("Vui lòng chọn ảnh trước.");
      return;
    }

    const formData = new FormData();
    formData.append("file", avatarFile);
    console.log("Avatar file added to FormData:", avatarFile);
    console.log("FormData prepared:", formData);

    try {
      console.log("Bắt đầu upload avatar...");
      setIsLoading(true);
      console.log("Uploading avatar with FormData:", formData);
      const data = await convertImg(formData);
      console.log("Avatar data:", data);
      if (data?.urlResponse) {
        setUrl(data.urlResponse); // cập nhật URL avatar mới
        setSuccessMessage("Tải ảnh thành công!");
        setTimeout(() => setSuccessMessage(null), 3000);
        closeModal('avatar'); // đóng modal sau khi upload thành công
      } else {
        throw new Error("Không nhận được đường dẫn ảnh từ server.");
      }
    } catch (error) {
      alert("Upload ảnh thất bại, vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  //----------------------------------------------
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const res = await getProfile();
        setUrl(res.data.result.avatar || "");
        setInfor({
          name: res.data.result.name || "",
          phone: res.data.result.phone || "",
          email: res.data.result.email || "",
          addresses: res.data.result.addresses || []
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setSuccessMessage("Lỗi khi tải thông tin, vui lòng thử lại!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const res = await fetch("https://provinces.open-api.vn/api/?depth=3");
        const data = await res.json();
        setAddressData(data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu địa phương:", err);
      }
    };
    fetchAddressData();
  }, []);

  const getCityName = (id) => {
    const city = addressData.find(item => item.code === id);
    return city?.name || "Không rõ";
  };

  const getDistrictName = (cityId, districtId) => {
    const city = addressData.find(item => item.code === cityId);
    const district = city?.districts.find(d => d.code === districtId);
    return district?.name || "Không rõ";
  };

  const getWardName = (cityId, districtId, wardId) => {
    const city = addressData.find(item => item.code === cityId);
    const district = city?.districts.find(d => d.code === districtId);
    const ward = district?.wards.find(w => w.code === wardId);
    return ward?.name || "Không rõ";
  };

  const openEditModal = (field, index = null) => {
    if (field === 'address' && index !== null) {
      const address = infor.addresses[index];
      setTempData({
        ...tempData,
        address: {
          detail: address.detail || "",
          cityId: address.cityId || "",
          districtId: address.districtId || "",
          wardId: address.wardId || "",
          index: index
        }
      });
    } else {
      setTempData({
        ...tempData,
        [field]: infor[field] || ""
      });
    }
    setEditModals({
      ...editModals,
      [field]: true
    });
  };

  const closeModal = (field) => {
    setEditModals({
      ...editModals,
      [field]: false
    });
  };

  const saveChanges = (field) => {
    if (field === 'address') {
      const newAddresses = [...infor.addresses];
      const oldAddress = newAddresses[tempData.address.index];

      newAddresses[tempData.address.index] = {
        addressId: oldAddress.addressId,
        userAddressId: oldAddress.userAddressId,
        detail: tempData.address.detail,
        cityId: tempData.address.cityId,
        districtId: tempData.address.districtId,
        wardId: tempData.address.wardId,
      };

      setInfor({
        ...infor,
        addresses: newAddresses,
      });
    } else {
      setInfor({
        ...infor,
        [field]: tempData[field],
      });
    }
    closeModal(field);
  };

  const getDistrictsByCity = (cityId) => {
    const city = addressData.find(item => item.code === cityId);
    return city?.districts || [];
  };

  const getWardsByDistrict = (cityId, districtId) => {
    const city = addressData.find(item => item.code === cityId);
    const district = city?.districts.find(d => d.code === districtId);
    return district?.wards || [];
  };

  const handleAddressChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: field === 'detail' ? value : parseInt(value) || "",
        ...(field === 'cityId' ? { districtId: "", wardId: "" } : {}),
        ...(field === 'districtId' ? { wardId: "" } : {})
      }
    }));
  };

  const handleXacNhan = async () => {
    const payload = {
      avatar: url,
      name: infor.name,
      email: infor.email,
      phone: infor.phone,
      addressRequestList: infor.addresses.map((item) => ({
        userAddressId: item.userAddressId,
        addressId: item.addressId,
        cityId: item.cityId,
        districtId: item.districtId,
        wardId: item.wardId,
        detail: item.detail.trim()
      }))
    };
    console.log("TT:", payload)

    setIsLoading(true);
    try {
      const response = await updateInfor(payload);
      if (response.status === 200 || response.data?.success) {
        setSuccessMessage("Cập nhật thông tin thành công!");
        const res = await getProfile();
        setUrl(res.data.result.avatar || "");
        setInfor({
          name: res.data.result.name || "",
          phone: res.data.result.phone || "",
          email: res.data.result.email || "",
          addresses: res.data.result.addresses || []
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error("Update failed with unexpected response");
      }
    } catch (error) {
      console.error("Error updating information:", error);
      setSuccessMessage("Cập nhật thất bại, vui lòng thử lại!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-8">
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="text-white text-lg font-semibold">Đang xử lý...</div>
        </div>
      )}
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Check className="h-5 w-5" />
          {successMessage}
        </div>
      )}
      {infor ? (
        <div className="w-full max-w-2xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-center relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h1 className="text-xl font-bold text-white mb-3">Thông tin cá nhân</h1>
                <div className="relative inline-block">
                  <img
                    src={url || "https://via.placeholder.com/64"}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full border-3 border-white/30 shadow-lg mx-auto object-cover"
                  />
                  <button
                    onClick={() => openEditModal('avatar')}
                    className="absolute -bottom-1 -right-1 p-1.5 bg-white text-blue-500 hover:bg-blue-50 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Họ và Tên
                  </label>
                  <button
                    onClick={() => openEditModal('name')}
                    className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <User className="h-4 w-4 text-blue-500" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm"
                    value={infor.name || ""}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <button
                    onClick={() => openEditModal('email')}
                    className="p-1 text-green-500 hover:bg-green-50 rounded transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Mail className="h-4 w-4 text-green-500" />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm"
                    value={infor.email || ""}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <button
                    onClick={() => openEditModal('phone')}
                    className="p-1 text-orange-500 hover:bg-orange-50 rounded transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Phone className="h-4 w-4 text-orange-500" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm"
                    value={infor.phone || ""}
                    readOnly
                  />
                </div>
              </div>
              <div>
                {infor.addresses?.map((item, index) => {
                  const cityId = item.cityId;
                  const districtId = item.districtId;
                  const wardId = item.wardId;
                  const fullAddress = `${item.detail}, ${getWardName(cityId, districtId, wardId)}, ${getDistrictName(cityId, districtId)}, ${getCityName(cityId)}`;
                  return (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Địa chỉ {index + 1}
                        </label>
                        <button
                          onClick={() => openEditModal('address', index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <MapPin className="h-4 w-4 text-red-500" />
                        </div>
                        <input
                          type="text"
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm"
                          value={fullAddress}
                          readOnly
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ position: 'relative', margin: '0 auto', width: '150px' }}>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out"
                  onClick={handleXacNhan}
                  disabled={isLoading}

                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Đang tải thông tin...</h1>
            <p className="text-gray-600">Vui lòng đợi trong giây lát.</p>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa tên */}
      <Modal
        isOpen={editModals.name}
        onClose={() => closeModal('name')}
        title="Chỉnh sửa họ tên"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên mới
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={tempData.name}
              onChange={(e) => setTempData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nhập họ tên..."
              autoFocus
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => saveChanges('name')}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Lưu
            </button>
            <button
              onClick={() => closeModal('name')}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal chỉnh sửa email */}
      <Modal
        isOpen={editModals.email}
        onClose={() => closeModal('email')}
        title="Chỉnh sửa email"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email mới
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={tempData.email}
              onChange={(e) => setTempData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Nhập email mới..."
              autoFocus
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => saveChanges('email')}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Lưu
            </button>
            <button
              onClick={() => closeModal('email')}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal chỉnh sửa số điện thoại */}
      <Modal
        isOpen={editModals.phone}
        onClose={() => closeModal('phone')}
        title="Chỉnh sửa số điện thoại"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại mới
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={tempData.phone}
              onChange={(e) => setTempData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Nhập số điện thoại..."
              autoFocus
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => saveChanges('phone')}
              className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Lưu
            </button>
            <button
              onClick={() => closeModal('phone')}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal chỉnh sửa địa chỉ */}
      <Modal
        isOpen={editModals.address}
        onClose={() => closeModal('address')}
        title="Chỉnh sửa địa chỉ"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tỉnh/Thành phố
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={tempData.address.cityId}
              onChange={(e) => handleAddressChange('cityId', e.target.value)}
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {addressData.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quận/Huyện
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={tempData.address.districtId}
              onChange={(e) => handleAddressChange('districtId', e.target.value)}
              disabled={!tempData.address.cityId}
            >
              <option value="">Chọn quận/huyện</option>
              {getDistrictsByCity(tempData.address.cityId).map((district) => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phường/Xã
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={tempData.address.wardId}
              onChange={(e) => handleAddressChange('wardId', e.target.value)}
              disabled={!tempData.address.districtId}
            >
              <option value="">Chọn phường/xã</option>
              {getWardsByDistrict(tempData.address.cityId, tempData.address.districtId).map((ward) => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ chi tiết
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={tempData.address.detail}
              onChange={(e) => setTempData(prev => ({
                ...prev,
                address: { ...prev.address, detail: e.target.value }
              }))}
              placeholder="Số nhà, tên đường..."
              autoFocus
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => saveChanges('address')}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Lưu
            </button>
            <button
              onClick={() => closeModal('address')}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal thay đổi avatar */}
      <Modal
        isOpen={editModals.avatar}
        onClose={() => closeModal('avatar')}
        title="Thay đổi ảnh đại diện"
      >
        <div className="space-y-4">
          <div className="text-center">
            <img
              src={url || "https://via.placeholder.com/64"}
              alt="Current Avatar"
              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-200 mb-4"
            />
            <p className="text-sm text-gray-600 mb-4">
              Chọn ảnh mới từ máy tính của bạn
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="avatar-upload"
              onChange={onFileChange
              }
            />
            <label
              htmlFor="avatar-upload"
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              <Camera className="h-4 w-4" />
              Chọn ảnh
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleAvatarUpload}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              Xong
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Infor;