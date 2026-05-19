import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Pagination from "../../../components/pagination/index.pagination";
import { fullTime } from "../../../helpers/convertTime";
import { ListRole } from "../../../hooks/listRole";
import { listAccount } from "../../../services/admin/account.service";
import CreateAccount from "./create.account";
import DeleteAccount from "./delete.account";
import UpdateAccount from "./update.account";

export default function ListAccount() {
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limitAccount, setLimitAccount] = useState(1);
  const [totalAccount , setTotalAccount] = useState(1);
  const [filter, setFilter] = useState({
    searchKey: "",
    roleId: "",
    status : "",
    pageNumber: currentPage
  });

  const { roles } = ListRole();
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const fetchListAccount = async () => {
    const res = await listAccount(filter);
    if (res.status == 200) {
      setAccounts(res.data.result.accounts);
      setTotalAccount(res.data.result.totalAccounts);
      setLimitAccount(res.data.result.limitAccount);
    }
  };


  useEffect(() => {
    fetchListAccount();
  }, [filter]);

  const reload = () => fetchListAccount();

  // pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setFilter((prev) => ({ ...prev, pageNumber: newPage }));

  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    const updateFilter = {
      ...filter,
      [name]: value,
      pageNumber: 1
    };
    setFilter(updateFilter);
    setCurrentPage(1);
  }

  const totalPages = limitAccount > 0 ? Math.ceil(totalAccount / limitAccount) : 1;
  
  
  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} pauseOnHover={false} />
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
            Quản lý tài khoản
          </h1>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" onClick={handleShowModal}>
            <Plus className="w-4 h-4" />
            Thêm người dùng
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full sm:w-auto sm:flex-1">
            <input
              name="searchKey"
              type="text"
              placeholder="🔍 Tìm kiếm người dùng..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:max-w-xs"
              onChange={handleFilter}
            />
            <select
              onChange={handleFilter}
              name="roleId"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">👤 Tất cả vai trò</option>
              <option value="USER">Người dùng</option>
              <option value="ADMIN">Quản trị viên</option>
            </select>
            <select
              onChange={handleFilter}
              name="status"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">⚙️ Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>
        </div>
        {/* Table */}
        <div className="hidden sm:block bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Người dùng</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Chức vụ</th> {/* UPDATED */}
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium">{user.name}</span>
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">
                    <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${user.role.code === "USER" ? "bg-indigo-500" : "bg-teal-400"}`}>
                      {user.role.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">{fullTime(user.created)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer ${user.status
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-300 text-gray-800"
                        }`}
                    >
                      {user.status ? "Hoạt động" : "Người hoạt động"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">  
                    <UpdateAccount item={user} reload={reload} listRoles={roles}/>
                    <DeleteAccount item={user} reload={reload} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden space-y-4">
          {accounts.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-800">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <strong>Ngày tạo:</strong> {fullTime(user.created)}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Chức vụ:</strong>{" "}
                <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${user.role.code === "USER" ? "bg-indigo-500" : "bg-teal-400"}`}>
                  {user.role.name} {/* UPDATED */}
                </span>
              </div>
              <div className="text-sm">
                <strong>Trạng thái:</strong>{" "}
                <span
                  className={`inline-block font-semibold px-2 py-1 rounded-full text-xs ${user.status
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-300 text-gray-800"
                    }`}
                >
                  {user.status ? "Hoạt động" : "Ngừng hoạt động"}
                </span>
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <UpdateAccount item = {user} reload={reload} type="mobile" listRoles={roles}/>  
                <DeleteAccount item={user} reload={reload} type="mobile"/>
              </div>
            </div>      
          ))}
        </div>
        <Pagination totalPages={totalPages} onPageChange={handlePageChange} currentPage={currentPage}/>
      </div>
      <CreateAccount showModal={showModal} handleCloseModal={handleCloseModal} reload={reload} />
    </>
  );
}
