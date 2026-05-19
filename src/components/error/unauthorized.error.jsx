import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Forbidden403 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">403</h1>
        <p className="text-lg text-gray-600 mb-6">Bạn không có quyền truy cập trang này.</p>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default Forbidden403;
