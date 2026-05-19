import { logout } from "../../services/Client/user.service";

export const handleLogout = async () => {
        const res = await logout();
        if(res.status == 200){
            localStorage.clear();
            window.location.href = "/login";
        }
    };
