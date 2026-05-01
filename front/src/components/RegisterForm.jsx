import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router";
import { AuthContext } from "../stores/stores";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (password !== confirmPassword) {
      setError("ПАРОЛИ НЕ СОВПАДАЮТ");
      setLoading(false);
      return;
    }
    
    try {
      const res = await axios.post("http://localhost:3000/api/register", { 
        name, 
        email, 
        password 
      });
      
      setUser(res.data.data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "ОШИБКА РЕГИСТРАЦИИ. ПОПРОБУЙТЕ ЕЩЁ РАЗ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-gradient-to-l from-emerald-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-full blur-3xl"></div>
        
        {/* Сетка */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(to right, #10b981 0.5px, transparent 0.5px),
                             linear-gradient(to bottom, #10b981 0.5px, transparent 0.5px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      <div className="w-full max-w-md relative z-20">
        <div className="bg-black/70 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-8 shadow-2xl shadow-emerald-500/5">
          {/* Заголовок */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  SPEED
                </span>
                <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                  FORCE
                </span>
              </h1>
            </div>
            <p className="text-gray-400 text-sm tracking-wider">СОЗДАНИЕ АККАУНТА</p>
          </div>

          {/* Форма */}
          <form onSubmit={handleRegister} className="space-y-8">
            {error && (
              <div className="bg-gradient-to-r from-red-900/30 to-red-900/10 border border-red-500/30 text-white px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Поле имени */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 tracking-wider">ИМЯ</span>
                <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
              </div>
              <input
                type="text"
                placeholder="ВАШЕ ИМЯ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-black/50 backdrop-blur-sm border border-gray-800 
                         text-white px-4 py-3 text-sm rounded-lg
                         focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30
                         placeholder:text-gray-600 transition-all duration-300
                         hover:border-gray-700"
              />
            </div>

            {/* Поле email */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 tracking-wider">EMAIL</span>
                <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
              </div>
              <input
                type="email"
                placeholder="EMAIL@EXAMPLE.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/50 backdrop-blur-sm border border-gray-800 
                         text-white px-4 py-3 text-sm rounded-lg
                         focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30
                         placeholder:text-gray-600 transition-all duration-300
                         hover:border-gray-700"
              />
            </div>

            {/* Поле пароля */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 tracking-wider">ПАРОЛЬ</span>
                <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-black/50 backdrop-blur-sm border border-gray-800 
                         text-white px-4 py-3 text-sm rounded-lg tracking-widest
                         focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30
                         placeholder:text-gray-600 transition-all duration-300
                         hover:border-gray-700"
              />
            </div>

            {/* Подтверждение пароля */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 tracking-wider">ПОВТОРИТЕ ПАРОЛЬ</span>
                <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-black/50 backdrop-blur-sm border border-gray-800 
                         text-white px-4 py-3 text-sm rounded-lg tracking-widest
                         focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30
                         placeholder:text-gray-600 transition-all duration-300
                         hover:border-gray-700"
              />
            </div>

            {/* Требования к паролю */}
            <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-3 tracking-wider">ТРЕБОВАНИЯ К ПАРОЛЮ:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${password.length >= 6 ? 'bg-emerald-500' : 'bg-gray-700'}`}></div>
                  <span className={`text-xs ${password.length >= 6 ? 'text-emerald-400' : 'text-gray-500'}`}>
                    НЕ МЕНЕЕ 6 СИМВОЛОВ
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${password === confirmPassword && password !== '' ? 'bg-emerald-500' : 'bg-gray-700'}`}></div>
                  <span className={`text-xs ${password === confirmPassword && password !== '' ? 'text-emerald-400' : 'text-gray-500'}`}>
                    ПАРОЛИ СОВПАДАЮТ
                  </span>
                </div>
              </div>
            </div>

            {/* Кнопка регистрации */}
            <button 
              type="submit" 
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-emerald-600 to-emerald-700 
                       text-white px-8 py-4 font-semibold text-sm tracking-wider rounded-lg 
                       hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 
                       transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    РЕГИСТРАЦИЯ...
                  </>
                ) : (
                  <>
                    СОЗДАТЬ АККАУНТ
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* Разделитель */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-black text-gray-500 text-xs">УЖЕ ЕСТЬ АККАУНТ?</span>
            </div>
          </div>

          {/* Ссылка на вход */}
          <div className="text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center w-full py-3 bg-black/60 backdrop-blur-sm 
                       text-white font-semibold text-sm tracking-wider rounded-lg border border-emerald-500/30 
                       hover:border-emerald-500/50 hover:bg-black/80 transition-all duration-300 
                       transform hover:-translate-y-0.5"
            >
              <span className="relative z-10 flex items-center gap-2">
                ВОЙТИ В АККАУНТ
              </span>
            </Link>
          </div>

          {/* Условия использования */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-gray-600 text-xs text-center leading-relaxed">
              РЕГИСТРИРУЯСЬ, ВЫ СОГЛАШАЕТЕСЬ С НАШИМИ УСЛОВИЯМИ ИСПОЛЬЗОВАНИЯ И ПОЛИТИКОЙ КОНФИДЕНЦИАЛЬНОСТИ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}