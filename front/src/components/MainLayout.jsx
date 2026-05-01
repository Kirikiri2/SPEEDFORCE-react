import { NavLink, Outlet, useNavigate } from "react-router";
import { useState } from "react";
import { CartContext, AuthContext } from "../stores/stores";

export default function MainLayout() {
  const [cart, setCart] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();

  const totalQuantity = cart.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <AuthContext.Provider value={[user, setUser]}>
      <CartContext.Provider value={[cart, setCart]}>
        <div className="main-layout min-h-screen flex flex-col bg-black">

{/* ================= HEADER ================= */}
<header className="relative p-3 sm:p-4 md:p-6 bg-black border-b border-gray-800 flex items-center z-40">
  
  {/* ЛЕВАЯ ЧАСТЬ - бургер меню и лого */}
  <div className="flex items-center gap-3 md:gap-4 flex-1 md:flex-none">
    {/* Бургер меню - скрыт на десктопе */}
    <button
      className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 transition-all duration-300 md:hidden border border-gray-700"
      onClick={() => setMenuOpen(!menuOpen)}
      aria-label="Меню"
    >
      <div className="space-y-1.5">
        <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </div>
    </button>

    {/* Лого на мобильных */}
    <div className="md:hidden">
      <NavLink to="/" className="text-white font-bold flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
          <span className="text-lg sm:text-xl font-bold tracking-tight font-(family-name:--font-title) ">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">S</span>
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">F</span>
          </span>
        </div>
      </NavLink>
    </div>

    {/* Лого на десктопе */}
    <div className="hidden md:flex items-center gap-3">
      <NavLink to="/" className="text-white text-2xl font-bold tracking-tighter flex items-center font-(family-name:--font-title) ">
        <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">SPEED</span>
        <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">FORCE</span>
      </NavLink>
    </div>
  </div>

  {/* ЦЕНТР - навигация (только десктоп) */}
  <nav className="hidden md:flex absolute left-1/3 lg:left-1/2 top-1/2 
                  -translate-x-1/2 -translate-y-1/2
                  items-center gap-4 lg:gap-6">
    {["/", "/products"].map((path, i) => (
      <NavLink
        key={path}
        to={path}
        className={({ isActive }) => `
          text-sm lg:text-base text-white font-medium tracking-wider px-4 lg:px-5 py-2
          transition-all duration-300 hover:bg-gray-900 border border-transparent hover:border-gray-700 rounded-lg
          ${isActive ? 'bg-gray-900 border-gray-700 font-bold text-emerald-400' : ''}
        `}
      >
        {["ГЛАВНАЯ", "МАШИНЫ"][i]}
      </NavLink>
    ))}

    {user?.role === "admin" && (
      <NavLink
        to="/sales"
        className={({ isActive }) => `
          text-sm lg:text-base text-white font-medium px-4 lg:px-5 py-2
          transition-all duration-300 hover:bg-gray-900 border border-transparent hover:border-gray-700 rounded-lg
          ${isActive ? 'bg-gray-900 border-gray-700 font-bold text-emerald-400' : ''}
        `}
      >
        СТАТИСТИКА
      </NavLink>
    )}
  </nav>

  {/* ПРАВАЯ ЧАСТЬ - действия пользователя */}
  <div className="absolute right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 flex items-center gap-3 sm:gap-3 md:gap-3">
    {/* Корзина */}
    <NavLink 
      to="/cart" 
      className="relative p-1 sm:p-2 rounded-lg hover:bg-gray-900 transition-all duration-300 border border-transparent hover:border-gray-700"
    >
      <div className="relative">
        <img src="./ShoppingBag.png" alt="" className="w-6 sm:h-6 md:w-8 md:h-8"/>
        {totalQuantity > 0 && (
          <span className="absolute -top-1.5 -right-1.5 text-[10px] sm:text-xs min-w-4 h-4 sm:min-w-5 sm:h-5 flex
            items-center justify-center bg-emerald-500 text-white rounded-full
            font-bold px-0.5 sm:px-1 border border-gray-800">
            {totalQuantity > 99 ? '99+' : totalQuantity}
          </span>
        )}
      </div>
    </NavLink>

    {/* Пользователь или кнопки входа/регистрации */}
    {user ? (
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {/* Аватар и имя */}
        <div className="hidden sm:flex items-center gap-2 md:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
            <span className="text-xs sm:text-sm font-bold text-white">{user.name.charAt(0)}</span>
          </div>
          <span className="text-gray-300 font-medium text-sm hidden lg:block truncate max-w-[100px]">
            {user.name}
          </span>
        </div>
        
        {/* Только аватар на маленьких экранах */}
        <div className="sm:hidden">
          <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
            <span className="text-xs font-bold text-white">{user.name.charAt(0)}</span>
          </div>
        </div>

        {/* Кнопка выхода */}
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-900 text-white border border-gray-700 
                   hover:bg-gray-800 hover:border-gray-600 transition-all duration-300 
                   font-medium text-xs sm:text-sm whitespace-nowrap"
        >
          <span className="hidden sm:inline">ВЫХОД</span>
          <span className="sm:hidden">ВЫЙТИ</span>
        </button>
      </div>
    ) : (
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <NavLink 
          to="/login" 
          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-900 text-white border border-gray-700 
                   hover:bg-gray-800 hover:border-gray-600 transition-all duration-300 
                   font-medium text-xs sm:text-sm whitespace-nowrap"
        >
          <span className="hidden sm:inline">ВХОД</span>
          <span className="sm:hidden">ВОЙТИ</span>
        </NavLink>
        <NavLink 
          to="/register" 
          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 
                   font-medium border-2 border-emerald-600 transition-all duration-300 
                   text-xs sm:text-sm whitespace-nowrap"
        >
          <span className="hidden sm:inline">РЕГИСТРАЦИЯ</span>
          <span className="sm:hidden">РЕГИСТР.</span>
        </NavLink>
      </div>
    )}
  </div>
</header>

          {/* MOBILE MENU */}
          {menuOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setMenuOpen(false)}
              />
              
              {/* Menu */}
              <nav className="absolute top-0 left-0 w-80 h-full bg-black border-r border-gray-800 shadow-2xl p-6 animate-slideIn">
                {/* Close button */}
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700"
                  >
                    <span className="text-white text-2xl">✕</span>
                  </button>
                </div>

                {/* Logo */}
                <div className="mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-10 bg-gradient-to-b from-emerald-500 to-emerald-400 rounded-full"></div>
                    <div className="text-white text-2xl font-bold tracking-tight font-(family-name:--font-title) ">
                      <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">SPEED</span>
                      <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">FORCE</span>
                    </div>
                  </div>
                </div>

                {/* User info */}
                {user && (
                  <div className="mb-8 p-4 rounded-lg bg-gray-900 border border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                        <span className="text-lg font-bold text-emerald-400">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-gray-400 text-sm">{user.email}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation links */}
                <div className="space-y-2 mb-8">
                  {["/", "/products"].map((path, i) => (
                    <NavLink
                      key={path}
                      to={path}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-3 text-white px-4 py-3 rounded-lg
                        transition-all duration-300 hover:bg-gray-900 border border-transparent hover:border-gray-700
                        ${isActive ? 'bg-gray-900 border-gray-700 text-emerald-400' : ''}
                      `}
                    >
                      <span className="text-xl">
                        {i === 0 ? (
                          <img src="./Home.png" alt="Home" className="w-6 h-6" />
                        ) : (
                          <img src="./GameController.png" alt="Game" className="w-6 h-6" />
                        )}
                      </span>
                      <span className="text-lg font-medium">
                        {["ГЛАВНАЯ", "МАШИНЫ"][i]}
                      </span>
                    </NavLink>
                  ))}

                  {user?.role === "admin" && (
                    <NavLink
                      to="/sales"
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-3 text-white px-4 py-3 rounded-lg
                        transition-all duration-300 hover:bg-gray-900
                        ${isActive ? 'bg-gray-900 border-gray-700 text-emerald-400' : ''}
                      `}
                    >
                      <span className="text-xl">📊</span>
                      <span className="text-lg font-medium">СТАТИСТИКА</span>
                    </NavLink>
                  )}
                </div>

                {/* Cart link */}
                <NavLink
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 mb-6"
                >
                  <div className="flex items-center gap-3">
                    <img src="./ShoppingBag.png" alt="" className="w-6 h-6"/>
                    <span className="text-lg font-medium text-white">КОРЗИНА</span>
                  </div>
                  {totalQuantity > 0 && (
                    <span className="bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-sm font-bold">
                      {totalQuantity}
                    </span>
                  )}
                </NavLink>

                {/* Auth section */}
                <div className="mt-auto pt-6 border-t border-gray-800">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300"
                    >
                      ВЫЙТИ ИЗ АККАУНТА
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <NavLink
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="block text-center bg-gray-900 text-white py-3 rounded-lg font-medium border border-gray-700 hover:bg-gray-800 transition-colors"
                      >
                        ВХОД
                      </NavLink>
                      <NavLink
                        to="/register"
                        onClick={() => setMenuOpen(false)}
                        className="block text-center bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors border-2 border-emerald-600"
                      >
                        РЕГИСТРАЦИЯ
                      </NavLink>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          )}

          {/* MAIN CONTENT */}
          <main className="flex-1 font-(family-name:--font-main) ">
            <Outlet />
          </main>

<footer className="bg-black/90 backdrop-blur-sm border-t border-emerald-500/10 relative overflow-hidden">


  <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
    {/* Верхняя часть футера */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
      {/* Логотип и описание */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-(family-name:--font-title) ">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">SPEED</span>
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">FORCE</span>
            </h2>
            <p className="text-emerald-400 text-sm tracking-wider">ПРЕМИАЛЬНАЯ АРЕНДА АВТОМОБИЛЕЙ</p>
          </div>
        </div>
        
        <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
          Откройте новый уровень свободы передвижения. Современный флот премиальных автомобилей, 
          цифровой сервис и индивидуальный подход к каждому клиенту.
        </p>
        
      </div>

      {/* CTA блок */}
      <div className="bg-gradient-to-br from-black/60 to-emerald-900/10 border  backdrop-blur-sm">
          
      {/* Быстрые ссылки */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-0.5 bg-emerald-500"></div>
          <h4 className="text-lg font-bold text-white">ИНФОРМАЦИЯ</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { to: "/", label: "О компании", color: "from-emerald-500/20 to-emerald-900/10" },
            { to: "/", label: "Для бизнеса", color: "from-blue-500/20 to-blue-900/10" },
            { to: "/", label: "FAQ", color: "from-purple-500/20 to-purple-900/10" },
            { to: "/", label: "Отзывы", color: "from-amber-500/20 to-amber-900/10" },
            { to: "/", label: "Блог", color: "from-rose-500/20 to-rose-900/10" },
            { to: "/", label: "Партнерам", color: "from-cyan-500/20 to-cyan-900/10" }
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={`group relative bg-gradient-to-br ${link.color} border border-gray-800 rounded-xl p-4 hover:border-white/60 transition-all duration-300`}
            >
              <div className="text-white font-medium group-hover:translate-x-1 transition-transform duration-300">
                {link.label}
              </div>
            </NavLink>
          ))}
        </div>
      </div>
      </div>
    </div>

    {/* Основные колонки */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
      {/* Категории авто */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-0.5 bg-emerald-500"></div>
          <h4 className="text-lg font-bold text-white">КАТЕГОРИИ АВТО</h4>
        </div>
        <ul className="space-y-4">
          {[
            { to: "/products", label: "Седаны бизнес-класса", icon: "./car1.png" },
            { to: "/products", label: "Внедорожники SUV", icon: "./car2.png" },
            { to: "/products", label: "Кроссоверы", icon: "./car3.png" },
            { to: "/products", label: "Спортивные авто", icon: "./car4.png" },
            { to: "/products", label: "Минивэны", icon: "./car5.png" }
          ].map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className="group flex items-center gap-3 p-3 bg-black/40 border border-emerald-500/10 rounded-lg hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300"
              >
                <img src={link.icon} alt='name' className="text-xl w-10 h-10"/>
                <span className="text-gray-300 group-hover:text-white transition-colors">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Контакты */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-0.5 bg-emerald-500"></div>
          <h4 className="text-lg font-bold text-white">КОНТАКТЫ</h4>
        </div>
        <ul className="space-y-4">
          {[
            { icon: "./Address.png", title: "Адрес", content: "Москва, ул. Автомобильная, д. 15", link: "#" },
            { icon: "./Phone.png", title: "Телефон", content: "8 (800) 123-45-67", link: "tel:+78001234567" },
            { icon: "./Email.png", title: "Email", content: "info@speedforce.ru", link: "mailto:info@speedforce.ru" },
            { icon: "./Clock.png", title: "Режим работы", content: "Круглосуточно, 24/7", link: null }
          ].map((item, index) => (
            <li key={index} className="group">
              <div className="flex items-start gap-3 p-3 bg-black/40 border border-emerald-500/10 rounded-lg hover:border-emerald-500/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <img src={item.icon} alt='name' className="text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="text-emerald-400 text-sm font-semibold">{item.title}</div>
                  {item.link ? (
                    <a 
                      href={item.link} 
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <div className="text-gray-300">{item.content}</div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>

    {/* Разделитель */}
    <div className="relative mb-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
      </div>
      <div className="relative flex justify-center">
        <div className="px-4 bg-black text-emerald-500 text-sm tracking-wider">
          SPEEDFORCE NETWORK
        </div>
      </div>
    </div>

    {/* Нижняя часть */}
    <div className="pt-8 border-t border-emerald-500/10">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="text-center lg:text-left">
          <p className="text-gray-500 text-sm mb-2">
            © 2025 SPEEDFORCE. Все права защищены.
          </p>
          <p className="text-emerald-500/60 text-xs">
            Премиальная аренда автомобилей
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { label: "Политика конфиденциальности", to: "/" },
            { label: "Условия аренды", to: "/" },
            { label: "Договор оферты", to: "/" },
            { label: "Карта сайта", to: "/" }
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="text-gray-500 hover:text-emerald-400 text-sm transition-colors duration-300 group"
            >
              {link.label}
              <span className="block h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/0 group-hover:via-emerald-500 group-hover:to-emerald-500/0 transition-all duration-500"></span>
            </NavLink>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-100"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-200"></div>
          </div>
          <span className="text-emerald-500/70 text-xs">ONLINE 24/7</span>
        </div>
      </div>
    </div>

  </div>
</footer>
        </div>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}