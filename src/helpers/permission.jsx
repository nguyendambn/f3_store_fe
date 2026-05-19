import { updateRole } from "../services/admin/role.service";

export const handleUpdate = async () => {
    const table = document.querySelector("[table-permission]");
    if (table) {
        let permission = [];
        const rows = table.querySelectorAll("[data-name]");
        Array.from(rows).forEach(row => {
            const inputs = row.querySelectorAll("input");
            const name = row.getAttribute("data-name");
            if (name === "id") {
                inputs.forEach(input => {
                    permission.push({
                        "role_id": input.value,
                        permissions: []
                    })
                })
            } else {
                inputs.forEach((item, index) => {
                    const checked = item.checked;
                    if (checked) {
                        permission[index].permissions.push(name);
                    }
                })
            }
        })
        if (permission.length > 0) {
            const res = await updateRole({ data: permission });
            return res;
        }
    }
    return null;
}

export const handleChecked = () => {
    const table = document.querySelector("[table-permission]");
    const data = document.querySelector("[data-records]");
    const value = JSON.parse(data.getAttribute("data-records"));
    value.forEach((item, index) => {
        item.permissions.forEach(subItem => {
            const row = table.querySelector(`[data-name="${subItem}"]`);
            const inputs = row.querySelectorAll("input")[index];
            inputs.click();
        })
    })
}