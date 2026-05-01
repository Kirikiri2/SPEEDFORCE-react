import CartItem from "./CartItem";
import { useState } from "react";

export default function CartItems({ cart, totalItems, totalPrice, onOrder }) {
  const [formData, setFormData] = useState({ 
    name: "", 
    surname: "", 
    email: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("ЗАПОЛНИТЕ ВСЕ ОБЯЗАТЕЛЬНЫЕ ПОЛЯ");
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      onOrder(formData);
      setIsSubmitting(false);
    }, 1000);
  };

  const deliveryOptions = [
    { id: 1, label: "САМОВЫВОЗ", price: 0, time: "1-2 ЧАСА", desc: "ИЗ МАГАЗИНА TECHHUB" },
    { id: 2, label: "КУРЬЕРОМ", price: 300, time: "ДЕНЬ В ДЕНЬ", desc: "ПО ГОРОДУ" },
    { id: 3, label: "ПОЧТА", price: 200, time: "3-5 ДНЕЙ", desc: "ПО РОССИИ" }
  ];

  const [selectedDelivery, setSelectedDelivery] = useState(1);

  const deliveryPrice = deliveryOptions.find(d => d.id === selectedDelivery)?.price || 0;
  const finalPrice = totalPrice + deliveryPrice;

  const handlePromoApply = () => {
    if (promoCode.toUpperCase() === "TECHHUB10") {
      alert("ПРОМОКОД АКТИВИРОВАН: -10%");
    } else if (promoCode) {
      alert("НЕВЕРНЫЙ ПРОМОКОД");
    }
    setPromoCode("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl w-full">
      {/* Левая часть - товары */}
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white  mb-2 tracking-wider">
            КОРЗИНА ТОВАРОВ
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-gray-400">
            <span>ТОВАРОВ: {totalItems} ЕД.</span>
            <span className="hidden sm:block">|</span>
            <span>СУММА: {totalPrice.toLocaleString()} ₽</span>
            <span className="hidden sm:block">|</span>
            <span>ID: {Date.now().toString().slice(-6)}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {cart.map(product => (
            <CartItem key={product.id} product={product} />
          ))}
        </div>

        {/* Промокод */}
        <div className="mt-8 bg-black border-2 border-gray-800 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-400  text-sm tracking-wider">ПРОМОКОД</span>
                <div className="h-px flex-1 bg-gray-800"></div>
              </div>
              <input 
                type="text" 
                placeholder="ВВЕДИТЕ ПРОМОКОД"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full bg-gray-900 border-2 border-gray-700 
                         text-white px-4 py-3  text-sm
                         focus:outline-none focus:border-white
                         placeholder:text-gray-600 uppercase"
              />
            </div>
            <button 
              onClick={handlePromoApply}
              className="w-full sm:w-auto px-6 py-3 bg-gray-800 text-white font-bold 
                       border-2 border-gray-700 hover:bg-gray-700 hover:border-white 
                       transition-all duration-300"
            >
              ПРИМЕНИТЬ
            </button>
          </div>
          <div className="mt-3 text-gray-500  text-xs">
            ПРИМЕР: TECHHUB10 (СКИДКА 10%)
          </div>
        </div>
      </div>

      {/* Правая часть - оформление */}
      <div className="lg:col-span-1">
        <div className="sticky top-8">
          <div className="bg-black border-2 border-gray-800 p-6">
            <h3 className="text-xl font-bold text-white  mb-6 pb-4 
                         border-b-2 border-gray-800 tracking-wider">
              ОФОРМЛЕНИЕ ЗАКАЗА
            </h3>

            {/* Сводка заказа */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">ТОВАРЫ ({totalItems} ЕД.)</span>
                <span className="text-white  font-bold">{totalPrice.toLocaleString()} ₽</span>
              </div>
              
              {/* Доставка */}
              <div className="pt-3 border-t-2 border-gray-800">
                <div className="text-white  text-sm mb-3 tracking-wider">СПОСОБ ДОСТАВКИ</div>
                <div className="space-y-2">
                  {deliveryOptions.map(option => (
                    <label 
                      key={option.id}
                      className={`flex items-center justify-between p-3 cursor-pointer transition-all duration-200
                                ${selectedDelivery === option.id 
                                  ? 'bg-gray-800 border border-white' 
                                  : 'bg-gray-900 border border-gray-800 hover:bg-gray-800'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 border-2 flex items-center justify-center
                                      ${selectedDelivery === option.id ? 'border-white' : 'border-gray-700'}`}>
                          {selectedDelivery === option.id && (
                            <div className="w-2 h-2 bg-white"></div>
                          )}
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm">{option.label}</div>
                          <div className="text-gray-400 text-xs">{option.time}</div>
                          <div className="text-gray-500 text-xs">{option.desc}</div>
                        </div>
                      </div>
                      <div className="text-white  font-bold text-sm">
                        {option.price === 0 ? "0 ₽" : `${option.price} ₽`}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Итог */}
              <div className="pt-4 border-t-2 border-gray-800">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white  font-bold text-lg">ИТОГО К ОПЛАТЕ</div>
                    <div className="text-gray-400  text-xs">С УЧЁТОМ ДОСТАВКИ И НДС</div>
                  </div>
                  <div className="text-white  font-bold text-2xl">
                    {finalPrice.toLocaleString()} ₽
                  </div>
                </div>
              </div>
            </div>

            {/* Форма данных */}
            <div className="space-y-4 mb-6">
              <div className="text-gray-400  text-sm mb-2 tracking-wider">
                КОНТАКТНЫЕ ДАННЫЕ
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="ИМЯ *" 
                    value={formData.name} 
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-900 border-2 border-gray-700 
                             text-white px-4 py-3  text-sm
                             focus:outline-none focus:border-white
                             placeholder:text-gray-600 uppercase transition-all duration-200"
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    name="surname" 
                    placeholder="ФАМИЛИЯ" 
                    value={formData.surname} 
                    onChange={handleChange}
                    className="w-full bg-gray-900 border-2 border-gray-700 
                             text-white px-4 py-3  text-sm
                             focus:outline-none focus:border-white
                             placeholder:text-gray-600 uppercase transition-all duration-200"
                  />
                </div>
              </div>
              
              <input 
                type="email" 
                name="email" 
                placeholder="EMAIL *" 
                value={formData.email} 
                onChange={handleChange}
                required
                className="w-full bg-gray-900 border-2 border-gray-700 
                         text-white px-4 py-3  text-sm
                         focus:outline-none focus:border-white
                         placeholder:text-gray-600 uppercase transition-all duration-200"
              />
              
              <input 
                type="tel" 
                name="phone" 
                placeholder="ТЕЛЕФОН *" 
                value={formData.phone} 
                onChange={handleChange}
                required
                className="w-full bg-gray-900 border-2 border-gray-700 
                         text-white px-4 py-3  text-sm
                         focus:outline-none focus:border-white
                         placeholder:text-gray-600 transition-all duration-200"
              />
            </div>

            {/* Кнопка оформления */}
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || cart.length === 0}
              className={`w-full py-4  font-bold tracking-wider border-2 transition-all duration-300
                        ${isSubmitting || cart.length === 0
                          ? 'bg-gray-800 border-gray-700 cursor-not-allowed text-gray-400' 
                          : 'bg-white text-black border-white hover:bg-gray-100 hover:scale-[1.02]'} 
                        flex items-center justify-center gap-3`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                  ОБРАБОТКА...
                </>
              ) : cart.length === 0 ? (
                "КОРЗИНА ПУСТА"
              ) : (
                <>
                  ОФОРМИТЬ ЗАКАЗ
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>

            {/* Соглашение */}
            <p className="text-gray-500  text-xs text-center mt-4 leading-relaxed">
              НАЖИМАЯ КНОПКУ, ВЫ СОГЛАШАЕТЕСЬ С УСЛОВИЯМИ ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ
            </p>
          </div>

          {/* Информация о безопасности */}
          <div className="mt-4 bg-gray-900 border-2 border-gray-800 p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl mt-1">🔒</span>
              <div>
                <div className="text-white  font-bold text-sm mb-1">
                  БЕЗОПАСНАЯ ОПЛАТА
                </div>
                <div className="text-gray-400  text-xs">
                  256-БИТНОЕ SSL-ШИФРОВАНИЕ<br/>
                  ВАШИ ДАННЫЕ ЗАЩИЩЕНЫ
                </div>
              </div>
            </div>
          </div>

          {/* Преимущества */}
          <div className="mt-4 bg-black border-2 border-gray-800 p-4">
            <div className="text-white font-bold text-sm mb-3 tracking-wider">
              ПРЕИМУЩЕСТВА TECHHUB
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-white text-xs">✓</span>
                <span className="text-gray-300 text-xs">ГАРАНТИЯ 2 ГОДА</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white text-xs">✓</span>
                <span className="text-gray-300 text-xs">ТЕХПОДДЕРЖКА 24/7</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white text-xs">✓</span>
                <span className="text-gray-300  text-xs">14 ДНЕЙ НА ВОЗВРАТ</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white text-xs">✓</span>
                <span className="text-gray-300 text-xs">ОРИГИНАЛЬНАЯ ПРОДУКЦИЯ</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}