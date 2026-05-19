import { useState } from "react";
import { createRole } from "../../../services/admin/role.service";
import { toast } from "react-toastify";
import { notification } from "../../../helpers/toast";

function CreateRole({ onClose, reload }) {
    const [newRole, setNewRole] = useState({ name: "", description: "", code: "" });

    const handleCreate = async () => {
        if (!newRole.name || !newRole.description || !newRole.code) {
            notification(toast, "Vui lòng nhập đầy đủ tên, mô tả và mã quyền.");
            return;
        }
        const res = await createRole(newRole);
        if (res.status === 200) {
            notification(toast, res.data.message, "success");
            reload();
            onClose();
        } else if (res.status == 403) {
             notification(toast, "Không có quyền thực hiện chức năng này");
        } else {
            notification(toast, res.data.message);
        }
    };

    return (
        <>
            <div className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-medium">Tên Quyền</label>
                    <input
                        type="text"
                        name="name"
                        onChange={(e) => setNewRole({ ...newRole, [e.target.name]: e.target.value })}
                        className="w-full p-2 border rounded focus:outline-none"
                        placeholder="Nhập tên quyền"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Mã Quyền</label>
                    <input
                        type="text"
                        name="code"
                        onChange={(e) => setNewRole({ ...newRole, [e.target.name]: e.target.value })}
                        className="w-full p-2 border rounded focus:outline-none"
                        placeholder="Nhập mã quyền"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Mô Tả</label>
                    <textarea
                        name="description"
                        onChange={(e) => setNewRole({ ...newRole, [e.target.name]: e.target.value })}
                        className="w-full p-2 border rounded focus:outline-none"
                        placeholder="Nhập mô tả"
                        rows={3}
                    />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Hủy</button>
                    <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded">Thêm</button>
                </div>
            </div>
        </>
    );
}

export default CreateRole;
