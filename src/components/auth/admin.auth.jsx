import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute  = () => {
    const access_token = localStorage.getItem("accessToken");
    if(access_token == null){
        return <Navigate to = "/login" replace/>
    }else {
        const role = jwtDecode(access_token).scope.split(" ")[0];
        if(role == "ROLE_USER"){
            // localStorage.removeItem("accessToken");
            // return <Navigate to = "/login" replace/>
            return <Navigate to="/unauthorized" replace/>
        }
        return <Outlet />;
    }
}

export default AdminRoute;