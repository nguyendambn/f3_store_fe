import React, { useEffect, useState } from 'react';
import { listRole, updatePermission } from '../../../services/admin/role.service';
import { ToastContainer, toast } from 'react-toastify';
import { notification } from "../../../helpers/toast";
import { useNavigate } from 'react-router-dom';

const PermissionRole = () => {
  const navigate = useNavigate();

  const value = [
    ['PRODUCT_VIEW', 'PRODUCT_ADD', 'PRODUCT_UPDATE', 'PRODUCT_DELETE'],
    ['ROLE_VIEW', 'ROLE_ADD', 'ROLE_UPDATE', 'ROLE_DELETE', 'ROLE_PERMISSION'],
    ['CATEGORY_VIEW', 'CATEGORY_ADD', 'CATEGORY_UPDATE', 'CATEGORY_DELETE'],
    ['ACCOUNT_VIEW', 'ACCOUNT_ADD', 'ACCOUNT_UPDATE', 'ACCOUNT_DELETE'],
    ['ORDER_UPDATE', 'ORDER_DELETE']
  ];

  const title = [
    ['Xem', 'Thêm', 'Sửa', 'Xóa'],
    ['Xem', 'Thêm', 'Sửa', 'Xóa', 'Phân quyền'],
    ['Xem', 'Thêm', 'Sửa', 'Xóa'],
    ['Xem', 'Thêm', 'Sửa', 'Xóa'],
    ['Sửa', 'xóa']
  ];

  const featureNames = ['Sản phẩm', 'Nhóm quyền', 'Danh mục', "Tài khoản", "Đơn hàng"];

  const [permissionsData, setPermissionsData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rawRoles, setRawRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await listRole();
        if (res.status === 200) {
          const rolesFromAPI = res.data.result;
          setRawRoles(rolesFromAPI);

          const roleNames = rolesFromAPI.map(role => role.name);
          setRoles(roleNames);

          const generatedPermissions = value.map((actions, categoryIndex) => {
            const featureTitle = featureNames[categoryIndex];

            const actionItems = actions.map((actionCode, actionIndex) => {
              const label = title[categoryIndex][actionIndex];
              const actionKey = actionCode.toUpperCase();

              const actionPermissions = {};
              roleNames.forEach(roleName => {
                const role = rolesFromAPI.find(r => r.name === roleName);
                const hasPermission = role?.permissions?.some(p => p.name === actionKey);
                actionPermissions[roleName] = !!hasPermission;
              });

              return {
                name: label,
                value: actionKey,
                permissions: actionPermissions
              };
            });

            return {
              category: featureTitle,
              actions: actionItems
            };
          });
          setPermissionsData(generatedPermissions);
        }
      } catch (error) {
        console.error('Lỗi khi fetch dữ liệu role:', error);
        navigate("/unauthorized");
      }
    };

    fetchData();
  }, [navigate]);

  const handleCheckboxChange = (categoryIndex, actionIndex, role) => {
    setPermissionsData(prev => {
      const newData = [...prev];
      newData[categoryIndex].actions[actionIndex].permissions[role] =
        !newData[categoryIndex].actions[actionIndex].permissions[role];
      return newData;
    });
  };

  const handleUpdate = async () => {
    try {
      const result = rawRoles.map(role => {
        const selectedPermissions = [];

        permissionsData.forEach(category => {
          category.actions.forEach(action => {
            if (action.permissions[role.name]) {
              selectedPermissions.push(action.value);
            }
          });
        });

        return {
          roleId: role.id,
          permissions: [...new Set(selectedPermissions)]
        };
      });
      const res = await updatePermission(result);
      if (res.status === 200) {
        notification(toast, "Cập nhật thành công", "success");
      } else if (res.status === 403) {
         notification(toast, "Không có quyền thực hiện chức năng này");
      } else {
        notification(toast, "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error);
      notification(toast, "Lỗi hệ thống");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} pauseOnHover={false} />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Quản lý nhóm quyền</h2>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left font-semibold">
                  Tính năng
                </th>
                {roles.map((role) => (
                  <th
                    key={role}
                    className="border border-gray-300 px-4 py-2 bg-gray-100 text-center font-semibold"
                  >
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissionsData.map((categoryItem, categoryIndex) => (
                <React.Fragment key={categoryItem.category}>
                  <tr>
                    <td
                      colSpan={roles.length + 1}
                      className="border border-gray-300 px-4 py-2 bg-gray-200 font-semibold text-left"
                    >
                      {categoryItem.category}
                    </td>
                  </tr>
                  {categoryItem.actions.map((action, actionIndex) => (
                    <tr key={`${categoryItem.category}-${action.name}`}>
                      <td className="border border-gray-300 px-4 py-2 text-left">
                        {action.name || 'Phân quyền'}
                      </td>
                      {roles.map((role) => (
                        <td
                          key={`${categoryItem.category}-${action.name}-${role}`}
                          className="border border-gray-300 px-4 py-2 text-center"
                        >
                          <input
                            type="checkbox"
                            checked={action.permissions[role] || false}
                            onChange={() =>
                              handleCheckboxChange(categoryIndex, actionIndex, role)
                            }
                            className="h-5 w-5 cursor-pointer accent-blue-500"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700"
        >
          Cập nhật
        </button>
      </div>
    </>
  );
};

export default PermissionRole;
