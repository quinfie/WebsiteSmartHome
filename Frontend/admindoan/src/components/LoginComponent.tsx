import { FaReact } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";
import {
  InputWithLabel,
  SimpleInput,
  ThirdPartyAuthButton,
} from ".";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { useState } from "react";

interface LoginComponentProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ onLogin }) => {
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
    <div className="w-[500px] h-[750px] dark:bg-gray-900 bg-white flex flex-col justify-between items-center py-10 max-sm:w-[400px] max-[420px]:w-[320px] max-sm:h-[750px]">
      <div className="flex flex-col items-center gap-10">
        <FaReact className="text-5xl dark:text-whiteSecondary text-blackPrimary hover:rotate-180 hover:duration-1000 hover:ease-in-out cursor-pointer max-sm:text-4xl" />
        <h2 className="text-2xl dark:text-whiteSecondary text-blackPrimary font-medium max-sm:text-xl">
          Chào mừng đến với trang quản trị!
        </h2>
        <div className="flex gap-5">
          <ThirdPartyAuthButton>
            <FaGoogle className="text-2xl max-sm:text-xl" />
          </ThirdPartyAuthButton>
          <ThirdPartyAuthButton>
            <FaGithub className="text-2xl max-sm:text-xl" />
          </ThirdPartyAuthButton>
        </div>

        <p className="dark:text-gray-400 text-gray-700 text-xl max-sm:text-base">HOẶC</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <InputWithLabel label="Tên đăng nhập hoặc Email">
            <SimpleInput
              type="text"
              placeholder="Nhập tên đăng nhập hoặc email..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputWithLabel>

          <InputWithLabel label="Mật khẩu">
            <SimpleInput
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputWithLabel>

          <Link to="/forgot-password" className="dark:text-gray-400 text-gray-700 text-base dark:hover:text-gray-300 hover:text-gray-600 cursor-pointer transition-colors max-sm:text-sm">
            Quên mật khẩu?
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="dark:text-gray-400 text-gray-700 text-base cursor-pointer transition-colors flex gap-1 items-center max-sm:text-sm">
          Chưa có tài khoản?
          <Link
            to="/register"
            className="dark:text-whiteSecondary text-blackPrimary hover:text-black flex gap-1 items-center dark:hover:text-white max-sm:text-sm hover:underline"
          >
            Đăng ký <FaArrowRight className="mt-[2px]" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
