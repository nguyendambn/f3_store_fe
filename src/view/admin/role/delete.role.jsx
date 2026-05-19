import { Trash2 } from "lucide-react";
import { deleteRole } from "../../../services/admin/role.service";
import { notification } from "../../../helpers/toast";
import { toast } from "react-toastify";

function DeleteRole({ item, reload, type }) {

    const handleDeleteRole = async (id) => {
        const res = await deleteRole(id);
        if (res.status == 200) {
            reload();
        }else if (res.status == 403){
            notification(toast, "Không có quyền thực hiện chức năng này");
        }
    };

    return (
        <>
            {
                type == "desktop" ? (
                    <button onClick={() => handleDeleteRole(item.id)} className="text-red-500 hover:bg-red-100 p-2 rounded">
                        <Trash2 size={20} />
                    </button>
                ) : (
                    <button onClick={() => handleDeleteRole(item.id)} className="text-red-500 hover:bg-red-100 p-2 rounded">
                        <Trash2 size={20} />
                    </button>
                )
            }
        </>
    );
}

export default DeleteRole;