import { Trash } from "lucide-react";
import Swal from "sweetalert2";
import { deleteAccount } from "../../../services/admin/account.service";

function DeleteAccount({ reload, item, type = "desktop" }) {
  const handleDelete = async (id) => {
    const res = await deleteAccount(id);
    return res.status;
  };

  const handleClick = () => {
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Thay đổi trạng thái tài khoản",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Chấp nhận",
      cancelButtonText: "Hủy bỏ"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const isDeleted = await handleDelete(item.id);
        if (isDeleted == 200) {
          Swal.fire({
            title: "Đã cập nhật!",
            text: "Thay đổi trạng thái thành công.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
          reload();
        } else if (isDeleted == 403) {
          Swal.fire({
            title: "Lỗi",
            text: "Không có quyền thực hiện chức năng này",
            icon: "error",
            confirmButtonText: "OK"
          });
        } else {
          Swal.fire({
            title: "Lỗi",
            text: "Đã có lỗi xảy ra vui lòng thử lại!",
            icon: "error",
            confirmButtonText: "OK"
          });
        }
      }
    });
  };

  return (
    <>
      {type === "desktop" ? (
        <button onClick={handleClick} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
          <Trash className="w-4 h-4" />
        </button>
      ) : (
        <button onClick={handleClick} className="p-2 bg-red-100 text-red-600 rounded-full">
          <Trash className="w-4 h-4" />
        </button>
      )}
    </>
  );
}

export default DeleteAccount;
