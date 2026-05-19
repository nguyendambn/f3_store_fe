import { useState } from "react";
import { updateRole } from "../../../services/admin/role.service";
import { toast } from "react-toastify";
import { notification } from "../../../helpers/toast";

function UpdateRole({ role, onClose, reload }) {
    const [updatedRole, setUpdatedRole] = useState({
        name: role.name || "",
        description: role.description || "",
        code: role.code || ""
    });

    const handleUpdate = async () => {
  
        if (!updatedRole.name || !updatedRole.description || !updatedRole.code) {
            notification(toast, "Vui lòng nhập đầy đủ tên, mã và mô tả quyền.");
            return;
        }
        const res = await updateRole(role.id, updatedRole);
        if (res.status === 200) {
            notification(toast, "Cập nhật thành công!", "success");
            reload();
            onClose();
        } else if (res.status) {
            notification(toast, "Không có quyền thực hiện chức năng này");
        } else {
            notification(toast, "Cập nhật thất bại");
        }
    };

    return (
        <>
            <div className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-medium">Tên Quyền</label>
                    <input
                        type="text"
                        value={updatedRole.name}
                        onChange={(e) => setUpdatedRole({ ...updatedRole, name: e.target.value })}
                        className="w-full p-2 border rounded focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Mã quyền</label>
                    <input
                        type="text"
                        value={updatedRole.code}
                        onChange={(e) => setUpdatedRole({ ...updatedRole, name: e.target.value })}
                        className="w-full p-2 border rounded focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Mô Tả</label>
                    <textarea
                        value={updatedRole.description}
                        onChange={(e) => setUpdatedRole({ ...updatedRole, description: e.target.value })}
                        className="w-full p-2 border rounded focus:outline-none"
                        rows={3}
                    />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Hủy</button>
                    <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">Cập Nhật</button>
                </div>
            </div>
        </>
    );
}

export default UpdateRole;
