// ProductsList.jsx - Горизонтальные карточки
import { useEffect, useState } from "react";
import { NavLink } from "react-router";

export default function ProductsList({ visible }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:3000/api/products");
        const json = await res.json();
        setProducts(json.data);
      } catch (err) {
        console.error("Ошибка загрузки товаров:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const visibleCount = visible === "all" ? products.length : visible;

  if (loading) return (
    <div className="flex justify-center items-center min-h-[500px] bg-gradient-to-b from-black to-gray-900">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-20 h-20 border-4 border-emerald-500/20 rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-emerald-400 text-lg font-semibold mt-6 tracking-wider">ЗАГРУЗКА АВТОПАРКА</p>
        <p className="text-gray-500 text-sm mt-2">Подбираем лучшие автомобили...</p>
      </div>
    </div>
  );

  return (
    <div className="w-full px-3 xs:px-4 sm:px-6 py-8">
      {/* Фоновые эффекты */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Горизонтальная прокрутка на мобильных */}
        <div className="flex flex-col space-y-8 md:space-y-10">
          {products.slice(0, visibleCount).map((p, index) => (
            <NavLink
              key={p.id}
              to={`/products/${p.id}`}
              className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 
                       rounded-2xl border border-gray-800 overflow-hidden
                       transition-all duration-500 hover:border-emerald-500/20
                       hover:shadow-[0_0_50px_rgba(16,185,129,0.15)]
                       hover:-translate-y-1 flex flex-col md:flex-row
                       backdrop-blur-sm transform-gpu"
            >
              {/* Левый блок - изображение */}
              <div className="md:w-2/5 lg:w-3/5 relative min-h-[300px] md:min-h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 to-black/30"></div>
                
                {/* Изображение автомобиля */}
                <div className="relative h-full w-full p-4 xs:p-5 md:p-6">
                  <div className="relative w-full h-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black">
                    {/* Контейнер для изображения с внутренними отступами */}
                    <div className="relative w-full h-full ">
                      <img
                        src={`http://localhost:3000${p.image_url}`}
                        alt={p.name}
                        className="w-full h-full object-cover md:object-center rounded-lg 
                                 group-hover:scale-105 transition-all duration-500"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Эффект границы */}
                    <div className="absolute inset-0 rounded-xl border border-gray-800 
                                   group-hover:border-emerald-500/30 transition-colors duration-300 
                                   pointer-events-none"></div>
                    
                    {/* Эффект подсветки при наведении */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 
                                   via-emerald-500/5 to-emerald-500/0 opacity-0 
                                   group-hover:opacity-100 transition-opacity duration-500 
                                   pointer-events-none"></div>
                    
                  </div>
                  
                  {/* Эффект дороги */}
                  <div className="absolute bottom-4 left-4 right-4 h-8 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl"></div>
                  
                  {/* Статус доступности */}
                  <div className="absolute bottom-4 right-4">
                    <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-emerald-400 font-semibold">ДОСТУПЕН</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Правый блок - информация */}
              <div className="md:w-3/5 lg:w-2/3 p-6 xs:p-7 sm:p-8 md:p-10 flex flex-col justify-between">
                {/* Верхняя часть */}
                <div>
                  {/* Категория и год */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-emerald-400 bg-emerald-500/10 
                                     px-3 py-1.5 rounded-full border border-emerald-500/20">
                        {p.category.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-400">2024</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-gray-400">4.8</span>
                    </div>
                  </div>

                  {/* Название автомобиля */}
                  <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                    {p.name}
                  </h3>

                  {/* Описание */}
                  <p className="text-gray-300 text-base leading-relaxed mb-6 line-clamp-3">
                    {p.description}
                  </p>

                  {/* Технические характеристики */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div className="bg-gray-900/50 rounded-xl p-3 text-center border border-gray-800">
                      <div className="text-xs text-gray-400 mb-1">МОЩНОСТЬ</div>
                      <div className="text-lg font-bold text-emerald-400">250 л.с.</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-3 text-center border border-gray-800">
                      <div className="text-xs text-gray-400 mb-1">РАЗГОН</div>
                      <div className="text-lg font-bold text-emerald-400">5.2 с</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-3 text-center border border-gray-800">
                      <div className="text-xs text-gray-400 mb-1">ПРИВОД</div>
                      <div className="text-lg font-bold text-emerald-400">4WD</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-3 text-center border border-gray-800">
                      <div className="text-xs text-gray-400 mb-1">ТОПЛИВО</div>
                      <div className="text-lg font-bold text-emerald-400">Бензин</div>
                    </div>
                  </div>
                </div>

                {/* Нижняя часть - цена и CTA */}
                <div className="border-t border-gray-800/50 pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">СТОИМОСТЬ АРЕНДЫ В СУТКИ</div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl sm:text-5xl font-bold text-white">{p.price} ₽</span>
                      </div>
                    </div>
                    
                    <button className="group/btn flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-500 
                                     text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold 
                                     hover:from-emerald-700 hover:to-emerald-600 transition-all duration-300
                                     hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                      <span>АРЕНДОВАТЬ</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Эффект скорости */}
              <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent rotate-45"></div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}