// ProductItem.jsx - Современный дизайн
import { useContext, useEffect, useState } from "react";
import { useParams, NavLink } from "react-router"; 
import { CartContext } from "../stores/stores";

export default function ProductItem() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [cart, setCart] = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const cartItem = product
    ? cart.find(element => element.id === product.id)
    : null;

  const quantity = cartItem?.quantity || 0;

  useEffect(() => {
    async function fetchProductAndReviews() {
      try {
        const productRes = await fetch(`http://localhost:3000/api/products/${id}`);
        const productJson = await productRes.json();
        const productData = productJson.data;
        setProduct(productData);
        setActiveImage(productData.image_url);

        const reviewsRes = await fetch(`http://localhost:3000/api/products/${id}/reviews`);
        const reviewsJson = await reviewsRes.json();
        setReviews(reviewsJson.data);
      } catch (err) {
        console.error("Ошибка загрузки товара или отзывов:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProductAndReviews();
  }, [id]);

  const updateCartQuantity = (newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== product.id));
    } else {
      const existingItem = cart.find(element => element.id === product.id);

      if (existingItem) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        ));
      } else {
        setCart([
          ...cart,
          {
            ...product,
            quantity: newQuantity
          }
        ]);
      }
    }
  }

  const handleAdd = () => {
    if (!product) return;
    const currentQuantity = cart.find(item => item.id === product.id)?.quantity || 0;
    updateCartQuantity(currentQuantity + 1);
  };

  const handleRemove = () => {
    if (!product) return;
    const currentQuantity = cart.find(item => item.id === product.id)?.quantity || 0;
    if (currentQuantity > 0) {
      updateCartQuantity(currentQuantity - 1);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="text-center">
        <div className="relative inline-block mb-8">
          <div className="w-24 h-24 border-4 border-emerald-500/20 rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-white text-xl font-bold mb-2">ЗАГРУЗКА АВТОМОБИЛЯ</p>
        <p className="text-gray-400">Пожалуйста, подождите...</p>
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black px-4">
      <div className="text-center max-w-md">
        <div className="text-9xl font-bold text-emerald-500/10 mb-6">404</div>
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent blur-3xl"></div>
          <p className="text-white text-3xl font-bold relative">АВТОМОБИЛЬ НЕ НАЙДЕН</p>
        </div>
        <p className="text-gray-400 mb-8 text-lg">Возможно, этот автомобиль уже арендован или временно недоступен.</p>
        <NavLink 
          to="/products"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-500 
                   text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-600 
                   transition-all duration-300 group"
        >
          <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          НАЗАД К ВЫБОРУ
        </NavLink>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero секция */}
      <div className="relative py-12 xs:py-16 sm:py-20">
        {/* Фоновые эффекты */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/30 to-black"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
          {/* Навигация */}
          <div className="flex items-center justify-between mb-10 xs:mb-12">
            <nav className="flex items-center gap-2 text-sm">
              <NavLink to="/" className="text-gray-500 hover:text-emerald-400 transition-colors">Главная</NavLink>
              <span className="text-gray-700">›</span>
              <NavLink to="/products" className="text-gray-500 hover:text-emerald-400 transition-colors">Автомобили</NavLink>
              <span className="text-gray-700">›</span>
              <span className="text-emerald-400 font-semibold truncate max-w-[150px] xs:max-w-[250px]">{product.name}</span>
            </nav>
            <NavLink 
              to="/products"
              className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors"
            >
              Назад к выбору
                            <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </NavLink>
          </div>

          {/* Основной контент */}
          <div className="grid lg:grid-cols-2 gap-10 xs:gap-12">
            {/* Левая колонка - изображения */}
            <div className="space-y-6">
              {/* Главное изображение */}
              <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl 
                           border border-gray-800 overflow-hidden p-4 xs:p-6">
                <div className="relative aspect-[4/3]">
                  <img
                    src={`http://localhost:3000${activeImage || product.image_url}`}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  {/* Наложение градиента */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
                  
                  
                  {/* Статус */}
                  <div className="absolute bottom-4 right-4">
                    <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-emerald-400 font-semibold">В НАЛИЧИИ</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Быстрые характеристики */}
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
  {[
    { icon: '/power.png', label: 'Мощность', value: '250 л.с.' },
    { icon: '/speed.png', label: 'Разгон', value: '5.2 сек' },
    { icon: '/gear.png', label: 'Привод', value: '4WD' },
    { icon: '/fluet.png', label: 'Топливо', value: 'Бензин' }
  ].map((spec, idx) => (
    <div key={idx} className="bg-gray-900/50 rounded-xl p-3 text-center border border-gray-800">
      <img src={spec.icon} alt={spec.label} className="w-8 h-8 mx-auto mb-2" />
      <div className="text-xs text-gray-400 mb-1">{spec.label}</div>
      <div className="text-sm font-bold text-emerald-400">{spec.value}</div>
    </div>
  ))}
</div>
            </div>

            {/* Правая колонка - информация */}
            <div className="space-y-8 xs:space-y-10">
              {/* Заголовок и рейтинг */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-semibold text-emerald-400 bg-emerald-500/10 
                                 px-3 py-1.5 rounded-full border border-emerald-500/20">
                    {product.category.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <h1 className="text-4xl xs:text-5xl sm:text-6xl font-bold text-white leading-tight mb-4">
                  {product.name}
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Цена и бронирование */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl 
                           border border-gray-800 p-6 xs:p-8">
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4 mb-8">
                  <div>
                    <div className="text-sm text-gray-500 mb-2">СТОИМОСТЬ АРЕНДЫ В СУТКИ</div>
                    <div className="flex items-baseline gap-4">
                      <span className="text-5xl xs:text-6xl font-bold text-white">{product.price} ₽</span>
                    </div>
                  </div>
                </div>

                {/* Управление корзиной */}
                <div className="space-y-6">
                  {quantity === 0 ? (
                    <button
                      onClick={handleAdd}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 
                               text-white py-4 rounded-xl font-bold text-lg 
                               hover:from-emerald-700 hover:to-emerald-600 
                               transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]
                               flex items-center justify-center gap-3 group"
                    >
                      АРЕНДОВАТЬ СЕЙЧАС
                    </button>
                  ) : (
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-400">ВЫ АРЕНДУЕТЕ АВТОМОБИЛЬ НА</div>
                        <div className="text-xl font-bold text-emerald-400"> {quantity} суток</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleRemove}
                          className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-bold 
                                   hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <span>−</span> УБРАТЬ
                        </button>
                        <button
                          onClick={handleAdd}
                          className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-bold 
                                   hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <span>+</span> ДОБАВИТЬ
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <button className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center justify-center gap-1">
                      <span>Нужна помощь?</span>
                      <span>Связаться с менеджером </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="relative py-12 xs:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
          {/* Табы */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { id: 'overview', label: 'ОБЗОР' },
              { id: 'specs', label: 'ХАРАКТЕРИСТИКИ' },
              { id: 'reviews', label: 'ОТЗЫВЫ' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white'
                    : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Контент табов */}
          <div className="bg-gradient-to-b from-gray-900/50 to-black/50 rounded-2xl 
                        border border-gray-800 overflow-hidden">
            <div className="p-6 xs:p-8">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">ОБ АВТОМОБИЛЕ</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Современный премиальный автомобиль, сочетающий в себе роскошь, 
                    производительность и передовые технологии. Идеальный выбор для деловых поездок, 
                    семейных путешествий и городских перемещений.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-gray-900/30 rounded-xl p-4">
                      <div className="text-emerald-400 font-semibold mb-2">КОМФОРТ</div>
                      <div className="text-gray-300 text-sm">Кожаный салон, климат-контроль, мультимедиа система</div>
                    </div>
                    <div className="bg-gray-900/30 rounded-xl p-4">
                      <div className="text-emerald-400 font-semibold mb-2">БЕЗОПАСНОСТЬ</div>
                      <div className="text-gray-300 text-sm">ABS, ESP, 6 подушек безопасности, камера 360°</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { label: 'Двигатель', value: '2.0 л турбо' },
                      { label: 'Мощность', value: '250 л.с.' },
                      { label: 'Крутящий момент', value: '350 Н·м' },
                      { label: 'Коробка передач', value: '8-ступ. АКПП' },
                      { label: 'Привод', value: 'Полный' },
                      { label: 'Разгон 0-100 км/ч', value: '5.2 сек' },
                      { label: 'Макс. скорость', value: '250 км/ч' },
                      { label: 'Расход топлива', value: '8.5 л/100км' },
                      { label: 'Объем багажника', value: '480 л' }
                    ].map((spec, idx) => (
                      <div key={idx} className="bg-gray-900/30 rounded-xl p-3">
                        <div className="text-sm text-gray-400 mb-1">{spec.label}</div>
                        <div className="text-lg font-semibold text-white">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">ОТЗЫВЫ КЛИЕНТОВ</h3>
                      <p className="text-gray-400">Реальные отзывы об этом автомобиле</p>
                    </div>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-400 text-lg mb-2">Пока нет отзывов</p>
                      <p className="text-gray-600">Будьте первым, кто оставит отзыв!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="bg-gray-900/30 rounded-xl p-5 border border-gray-800">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-500 
                                           rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">U{rev.user_id.toString().slice(-2)}</span>
                              </div>
                              <div>
                                <div className="font-semibold text-white">Клиент #{rev.user_id}</div>
                                <div className="text-sm text-gray-400">
                                  {new Date(rev.created_at).toLocaleDateString('ru-RU')}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 bg-gray-900/50 px-3 py-1 rounded-lg">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < rev.stars ? 'text-emerald-400' : 'text-gray-700'}`} 
                                     fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="text-white font-bold ml-2">{rev.stars}.0</span>
                            </div>
                          </div>
                          <p className="text-gray-300 leading-relaxed italic">"{rev.review}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Кнопка назад */}
      <div className="py-10 text-center">
        <NavLink 
          to="/products"
          className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 mx-3
                   rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 
                   border border-gray-800 group"
        >
          ВЕРНУТЬСЯ К ВЫБОРУ АВТОМОБИЛЕЙ
        </NavLink>
      </div>
    </div>
  );
}