import { Outlet } from "react-router-dom";
import Footer from "./footer/index.footer";
import Header from "./header/index.header";
import { useEffect, useRef, useState } from "react";
import Chatbot from "../../../view/client/chatbot/index.chatbot";

const LayoutUser = () => {
    const headerRef = useRef(null);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        if (headerRef.current) {
            const height = headerRef.current.offsetHeight;
            setOffset(height);
        }
    }, []);
    return (
        <>

            <Header headerRef={headerRef} /> 
            <div style={{ marginTop: offset }} className="w-[90%] mx-auto">
                <Chatbot />
                <Outlet />
            </div>
            <Footer />
        </>
    );
}

export default LayoutUser;