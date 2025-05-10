import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { InputWithLabel, SimpleInput } from ".";

interface LoginComponentProps {
  onLogin: (username: string, password: string) => Promise<void>;
  error?: string;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ onLogin, error: externalError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin đăng nhập");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await onLogin(username, password);
    } catch (error) {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 space-y-8 border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Chào mừng trở lại
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Đăng nhập để tiếp tục
        </p>

        {(externalError || error) && (
          <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-md text-center">
            {externalError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputWithLabel label="Tên đăng nhập">
            <SimpleInput
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputWithLabel>

          <InputWithLabel label="Mật khẩu">
            <SimpleInput
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputWithLabel>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400"> </span>
            <Link to="/forgot-password" className="text-indigo-600 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md text-white font-medium transition-all ${isLoading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="flex items-center justify-between">
          <hr className="flex-1 border-t dark:border-gray-700" />
          <span className="mx-4 text-sm text-gray-400">Hoặc</span>
          <hr className="flex-1 border-t dark:border-gray-700" />
        </div>


        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline inline-flex items-center gap-1">
            Đăng ký <FaArrowRight />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
