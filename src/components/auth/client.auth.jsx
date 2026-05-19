import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { verifyToken } from "../../services/auth/auth.service";

function PrivateClient() {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const fetchApi = async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                navigate("/login", { replace: true });
            } else {
                try {
                    const isAuth = await verifyToken({ token: accessToken });
                    if (isAuth.status != 200) {
                        navigate("/login", { replace: true });
                    } else {
                        setChecking(false);
                    }
                } catch (error) {
                    navigate("/login", { replace: true });
                }
            }
        }
        fetchApi();
    }, [navigate]);

    if (checking) return null;
    return <Outlet />;
}

export default PrivateClient;
