import { useEffect, useState } from "react";
import { listRole } from "../services/admin/role.service";


export const ListRole = () => {
  const [roles, setRoles] = useState([]);
  const fetchData = async () => {
    const res = await listRole();
    if (res.status === 200) {
      setRoles(res.data.result);
    }else if (res.status === 403){
      setRoles(null);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  
  const reload = () => fetchData();

  return {roles, reload};
};