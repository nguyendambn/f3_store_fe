import { Button, Form, Modal, Select } from "antd";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { updateAccount } from "../../../services/admin/account.service";
import { notification } from "../../../helpers/toast";
import { toast } from "react-toastify";

function UpdateAccount({ listRoles, reload, item, type = "desktop" }) {
    const [showModal, setShowModal] = useState(false);
    const [form] = Form.useForm();

    const handleOpen = () => {
        setShowModal(true);
        form.setFieldsValue({ role_id: item.role.role_id });
    };

    const handleClose = () => {
        setShowModal(false);
        form.setFieldsValue({ role_id: item.role.role_id });
    };

    const handleSubmit = async (values) => {
        const res = await updateAccount(item.id, values);
        if (res.status == 200) {
            notification(toast, res.data.message, "success");
            setShowModal(false);
            reload();
        } else if (res.status == 403) {
            notification(toast, "Không có quyền thực hiện chức năng này");
        }
    };

    return (
        <>
            <button
                className={
                    type === "desktop"
                        ? "p-2 text-yellow-500 hover:bg-yellow-100 rounded-full transition-colors duration-150"
                        : "p-2 bg-yellow-100 text-yellow-600 rounded-full transition-colors duration-150"
                }
                onClick={handleOpen}
            >
                <Pencil className="w-4 h-4" />
            </button>

            <Modal
                title={<span className="text-lg font-semibold">Thay đổi quyền</span>}
                open={showModal}
                onCancel={handleClose}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="pt-4"
                >
                    <Form.Item
                        label={<span className="font-medium">Chọn quyền</span>}
                        name="role_id"
                        rules={[{ required: true, message: "Vui lòng chọn quyền!" }]}
                    >
                        <Select placeholder="-- Chọn quyền --" className="rounded-md">
                            {listRoles.map(role => (
                                <Select.Option key={role.id} value={role.id}>
                                    {role.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item className="text-right mt-6">
                        <Button
                            htmlType="submit"
                            type="primary"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-1.5 rounded-md w-full"
                        >
                            Thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default UpdateAccount;
