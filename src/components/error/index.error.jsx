import { faCircleExclamation, faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function Error() {
    return (
        <>
            <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-red-100 to-red-300">
                <div className="min-w-[100px] max-w-md max-h-[448px] max-auto p-3 rounded-md bg-white flex flex-col justify-center items-center gap-2">
                    <FontAwesomeIcon icon={faCircleExclamation} className="text-[50px] text-red-500" />
                    <h1 className="text-2xl font-bold">Không tìm thấy trang</h1>
                    <span className="max-w-[70%] text-center text-[15px] opacity-50">Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm</span>
                        <Link to="/" className="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-300 shadow-md cursor-pointer">
                        <FontAwesomeIcon icon={faHouse}/> Trở về trang chủ</Link>
                </div>
            </div>
        </>
    );
}

export default Error;