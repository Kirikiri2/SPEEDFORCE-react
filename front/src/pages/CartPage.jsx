import { useContext, useState } from "react";
import { CartContext } from "../stores/stores";
import { useNavigate, NavLink } from "react-router";

export default function CartPage() {
  const [cart, setCart] = useContext(CartContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert("АРЕНДА ОФОРМЛЕНА! СИСТЕМА SPEEDFORCE ПОДТВЕРДИЛА ВАШУ БРОНЬ!");
      setCart([]);
    }, 1500);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (id) => {
    if (window.confirm("ОТМЕНИТЬ АРЕНДУ ЭТОГО АВТОМОБИЛЯ?")) {
      setCart(cart.filter(item => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 px-3 xs:px-4 sm:px-6 py-8 xs:py-10 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Хлебные крошки */}
        <nav className="text-gray-400 text-xs xs:text-sm mb-8 xs:mb-10 font-medium flex items-center gap-1 xs:gap-2">
          <NavLink to="/" className="hover:text-emerald-400 transition-colors">Главная</NavLink>
          <span className="text-gray-600">›</span>
          <NavLink to="/products" className="hover:text-emerald-400 transition-colors">Автомобили</NavLink>
          <span className="text-gray-600">›</span>
          <span className="text-emerald-400 font-semibold">Корзина аренды</span>
        </nav>

        {/* Заголовок */}
        <div className="text-center mb-10 xs:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-white tracking-tight">
              КОРЗИНА <span className="text-emerald-400">АРЕНДЫ</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm xs:text-base">
            {cart.length > 0 ? `ВЫБРАННЫЕ АВТОМОБИЛИ (${totalItems} ЕД.)` : "ВАША КОРЗИНА АРЕНДЫ ПУСТА"}
          </p>
        </div>

        {cart.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-6 xs:gap-8">
            {/* Левая колонка - автомобили */}
            <div className="lg:col-span-2 space-y-6 xs:space-y-8">
              {/* Шапка */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-xl border border-gray-800 p-5 xs:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl xs:text-2xl font-bold text-white mb-2">ВАШИ АВТОМОБИЛИ</h2>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-emerald-400">Доступны для бронирования</span>
                    </div>
                  </div>

                </div>

                {/* Список автомобилей */}
                <div className="space-y-4 xs:space-y-6">
                  {cart.map(item => (
                    <div 
                      key={item.id}
                      className="group bg-gradient-to-br from-gray-900 to-black rounded-xl 
                               border border-gray-800 hover:border-white/60
                               transition-all duration-300 p-4 xs:p-5"
                    >
                      <div className="flex flex-col md:flex-row gap-4 xs:gap-5">
                        {/* Изображение автомобиля */}
                        <div className="md:w-2/5 lg:w-1/3">
                          <div className="relative bg-black rounded-lg overflow-hidden border border-gray-800">
                            <img
                              src={`http://localhost:3000${item.image_url}`}
                              alt={item.name}
                              className="w-full h-48 xs:h-52 object-cover"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="text-xs font-bold text-emerald-400 bg-black/80 
                                             px-2 py-1 rounded border border-emerald-500/30">
                                {item.category.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Информация об автомобиле */}
                        <div className="md:w-3/5 lg:w-2/3 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="text-lg xs:text-xl font-bold text-white mb-2">{item.name}</h3>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-emerald-400">2024 ГОД</span>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-gray-400">Пробег: 0 км</span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-gray-500 hover:text-red-400 transition-colors 
                                         w-8 h-8 flex items-center justify-center hover:bg-gray-800/50 rounded"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>

                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                              {item.description}
                            </p>
                          </div>

                          {/* Управление количеством и цена */}
                          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4">
                            {/* Количество */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center border border-gray-800 rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-10 h-10 bg-gray-900 text-white font-bold 
                                           hover:bg-gray-800 transition-colors rounded-l-lg"
                                >
                                  −
                                </button>
                                <div className="w-12 h-10 bg-black text-white font-bold 
                                              flex items-center justify-center border-x border-gray-800">
                                  {item.quantity}
                                </div>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-10 h-10 bg-gray-900 text-white font-bold 
                                           hover:bg-gray-800 transition-colors rounded-r-lg"
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-xs text-gray-500">суток</span>
                            </div>

                            {/* Цена */}
                            <div className="text-right">
                              <div className="text-lg xs:text-xl font-bold text-white">
                                {(item.price * item.quantity).toLocaleString()} ₽
                              </div>
                              <div className="text-xs text-gray-500">за {item.quantity} суток</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Кнопка продолжения */}
              <button
                onClick={handleContinueShopping}
                className="w-full bg-gradient-to-r from-gray-900 to-black text-white 
                         py-3 xs:py-4 rounded-xl font-semibold border border-gray-800 
                         hover:border-white/60 hover:bg-gray-800/50 
                         transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                ВЫБРАТЬ ЕЩЕ АВТОМОБИЛИ
              </button>
            </div>

            {/* Правая колонка - итоги */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6 xs:space-y-8">
                {/* Итоговая информация */}
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-xl border border-gray-800 p-5 xs:p-6">
                  <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-gray-800">
                    ИТОГИ БРОНИРОВАНИЯ
                  </h2>

                  <div className="space-y-4 mb-6">
                    {/* Детали */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Автомобили ({totalItems} ед.)</span>
                        <span className="font-semibold text-white">{totalPrice.toLocaleString()} ₽</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Страхование</span>
                        <span className="font-semibold text-emerald-400">Включено</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Доставка автомобиля</span>
                        <span className="font-semibold text-emerald-400">Бесплатно</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Пробег</span>
                        <span className="font-semibold text-white">Безлимитный</span>
                      </div>
                    </div>

                    {/* Итого */}
                    <div className="pt-4 border-t border-gray-800">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <div className="text-lg font-bold text-white">ИТОГО К ОПЛАТЕ</div>
                        </div>
                        <div className="text-3xl font-bold text-white">
                          {totalPrice.toLocaleString()} ₽
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Информация о бронировании */}
                  <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-white">ВСЕ АВТОМОБИЛИ ДОСТУПНЫ</span>
                    </div>
                    <div className="space-y-2 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Минимальный срок аренды</span>
                        <span>1 сутки</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Бесплатная отмена</span>
                        <span>за 24 часа</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Получение автомобиля</span>
                        <span>в день брони</span>
                      </div>
                    </div>
                  </div>

                  {/* Кнопка оформления */}
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className={`w-full py-4 rounded-xl font-bold transition-all duration-300 
                              flex items-center justify-center gap-3 group
                              ${isProcessing 
                                ? 'bg-gray-800 cursor-not-allowed text-gray-400' 
                                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]'}`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                        ОБРАБОТКА БРОНИ...
                      </>
                    ) : (
                      <>
                        ЗАБРОНИРОВАТЬ
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Пустая корзина
          <div className="text-center py-16 xs:py-20">
            <div className="max-w-md mx-auto px-4">
              {/* Иконка */}
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 rounded-full blur-xl"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-gray-900 to-black 
                             rounded-full border-2 border-gray-800 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
              </div>

              {/* Текст */}
              <h2 className="text-2xl xs:text-3xl font-bold text-white mb-3">
                КОРЗИНА АРЕНДЫ ПУСТА
              </h2>
              <p className="text-gray-400 mb-8 text-sm xs:text-base text-wrap lg:text-nowrap">
                Добавьте автомобили для бронирования и отправляйтесь в путь
              </p>

              {/* Кнопки */}
              <div className="space-y-3">
                <button
                  onClick={handleContinueShopping}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 
                           text-white py-3 xs:py-4 rounded-xl font-semibold 
                           hover:from-emerald-700 hover:to-emerald-600 transition-all duration-300"
                >
                  ВЫБРАТЬ АВТОМОБИЛИ
                </button>
                <NavLink 
                  to="/"
                  className="inline-block w-full bg-gray-900/50 text-white py-3 xs:py-4 
                           rounded-xl font-semibold border border-gray-800 
                           hover:border-emerald-500/40 hover:bg-gray-800/50 transition-all duration-300"
                >
                  НА ГЛАВНУЮ
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}