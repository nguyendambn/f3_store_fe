import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { faCircleMinus, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Input, Modal, Select } from 'antd';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { delete_preview, preview } from '../../../helpers/preview_avatar';
import { notification } from '../../../helpers/toast';
import { ListRole } from '../../../hooks/listRole';
import { createAccount } from '../../../services/admin/account.service';

const { Option } = Select;

const CreateAccount = ({ showModal, handleCloseModal, reload }) => {

    const [fileUpload, setFileUpload] = useState(null);
    const [form] = Form.useForm();
    const { roles } = ListRole();

    const handleChangeAvatar = (e) => {
        preview(e);
        setFileUpload(e.target.files[0]);
    };

    const handleFinish = async (e) => {
        if (fileUpload == null) {
            notification(toast, "Vui lòng chọn ảnh đại diện");
        } else {
            const formData = new FormData();
            formData.append("avatar", fileUpload);
            for (const key in e) {
                formData.append(key, e[key]);
            }
            try {
                const res = await createAccount(formData);
                if (res.status == 200) {
                    notification(toast, res.data.message, "success");
                    form.resetFields();
                    handleCloseModal();
                    delete_preview();
                    setFileUpload(null);
                    reload();
                } else if (res.status == 403) {
                    notification(toast, "Không có quyền thực hiện chức năng này");
                } else {
                    notification(toast, "Email đã tồn tại");
                }
            } catch (error) {
                notification(toast, "Đã có lỗi xảy ra vui lòng thử lại");
            }
        }
    };

    const handleDeletePreview = () => {
        delete_preview();
        setFileUpload(null);
    };

    const closeModal = () => {
        form.resetFields();
        delete_preview();
        setFileUpload(null);

        if (typeof handleCloseModal === "function") handleCloseModal();
    }

    return (
        <Modal
            title="Tạo tài khoản mới"
            open={showModal}
            onCancel={closeModal}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                className="mt-4"
            >
                {/* Name */}
                <Form.Item
                    label="Tên người dùng"
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng tên!' }]}
                >
                    <Input placeholder="nguyenvana" prefix={<UserOutlined />} />
                </Form.Item>

                {/* Email */}
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' },
                    ]}
                >
                    <Input placeholder="example@gmail.com" prefix={<MailOutlined />} />
                </Form.Item>

                {/* Password */}
                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" prefix={<LockOutlined />} />
                </Form.Item>

                {/* Role */}
                <Form.Item
                    label="Quyền người dùng"
                    name="role_id"
                    rules={[{ required: true, message: 'Vui lòng chọn quyền!' }]}
                >
                    <Select placeholder="Chọn quyền">
                        {roles.map(role => (
                            <Option value={role.id}>{role.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Avatar */}
                <Form.Item
                >
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
                                        // disabled={isSubmitting}
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
                </Form.Item>

                {/* Submit */}
                <Form.Item>
                    <Button type="primary" className="w-full" htmlType="submit">
                        Tạo tài khoản
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateAccount;
