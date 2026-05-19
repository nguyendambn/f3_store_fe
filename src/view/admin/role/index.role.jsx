import { Edit, Plus, X } from 'lucide-react';
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { ListRole as ListRoles } from "../../../hooks/listRole";
import DeleteRole from "./delete.role";
import UpdateRole from './update.role';
import CreateRole from './create.role';
import Forbidden403 from "../../../components/error/unauthorized.error";
function ListRole() {
    const { roles, reload } = ListRoles();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRole, setCurrentRole] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const openAddModal = () => {
        setCurrentRole({});
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (role) => {
        setCurrentRole(role);
        setIsEditing(true);
        setIsModalOpen(true);
    };


    return (
        <>
            <ToastContainer position="top-center" autoClose={5000} pauseOnHover={false} />
            {roles == null ? (
                <Forbidden403 />
            ) : (
                <div className="container mx-auto p-4">
                    <div className="bg-white shadow-md rounded-lg">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold">Quản Lý Nhóm Quyền</h2>
                            <button
                                onClick={openAddModal}
                                className="bg-green-500 text-white px-4 py-2 rounded flex items-center hover:bg-green-600"
                            >
                                <Plus className="mr-2" size={20} /> Thêm Quyền
                            </button>
                        </div>

                        {/* Table for Desktop */}
                        <div className="hidden md:table w-full">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="p-3">STT</th>
                                        <th className="p-3">Tên Quyền</th>
                                        <th className="p-3">Mô Tả</th>
                                        <th className="p-3">Trạng thái</th>
                                        <th className="p-3 text-center">Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.map((role, index) => (
                                        <tr key={role.id} className="border-b hover:bg-gray-50">
                                            <td className="p-3">{index + 1}</td>
                                            <td className="p-3">{role.name}</td>
                                            <td className="p-3">{role.description}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-sm font-medium ${!role.deleted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {!role.deleted ? 'Hoạt động' : 'Ngừng hoạt động'}
                                                </span>
                                            </td>
                                            <td className="p-3 flex justify-center space-x-2">
                                                <button onClick={() => openEditModal(role)} className="text-blue-500 hover:bg-blue-100 p-2 rounded">
                                                    <Edit size={20} />
                                                </button>
                                                <DeleteRole item={role} reload={reload} type="desktop" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Cards for Mobile */}
                        <div className="block md:hidden p-4 space-y-4">
                            {roles.map((role, index) => (
                                <div key={role.id} className="border rounded-lg p-4 shadow-sm">
                                    <div className="text-sm text-gray-500 mb-1">STT: {index + 1}</div>
                                    <div className="font-semibold text-lg">{role.name}</div>
                                    <div className="text-gray-600 mb-2">{role.description}</div>
                                    <div className="text-sm mb-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${!role.deleted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {!role.deleted ? 'Hoạt động' : 'Ngừng hoạt động'}
                                        </span>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => openEditModal(role)} className="text-blue-500 hover:bg-blue-100 p-2 rounded">
                                            <Edit size={20} />
                                        </button>
                                        <DeleteRole item={role} reload={reload} type="mobile" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-96 p-6 relative">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                                >
                                    <X size={24} />
                                </button>
                                <h3 className="text-xl font-semibold mb-4">
                                    {isEditing ? 'Chỉnh Sửa Quyền' : 'Thêm Quyền Mới'}
                                </h3>

                                {isEditing
                                    ? <UpdateRole role={currentRole} onClose={() => setIsModalOpen(false)} reload={reload} />
                                    : <CreateRole onClose={() => setIsModalOpen(false)} reload={reload} />
                                }
                            </div>
                        </div>
                    )}
                </div>
            )}

        </>
    );
}

export default ListRole;