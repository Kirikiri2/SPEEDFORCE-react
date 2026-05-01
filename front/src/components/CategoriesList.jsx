import { useEffect, useState } from "react";
import { NavLink } from "react-router";

export default function CategoriesList({ visible }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:3000/api/categories");
        const json = await res.json();
        setCategories(json.data);
      } catch (err) {
        console.error("Ошибка загрузки категорий:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const visibleCount = visible === "all" ? categories.length : visible;

  if (loading) {
    return (
      <div className="flex justify-center py-10 xs:py-12 sm:py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 border-t-2 border-b-2 border-white mb-3 xs:mb-4"></div>
          <p className="text-gray-400 text-sm xs:text-base sm:text-lg tracking-wider px-4">
            ЗАГРУЗКА КАТЕГОРИЙ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-6 xs:my-8 sm:my-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 md:gap-8 max-w-7xl mx-auto px-2 xs:px-3 sm:px-4">
        {categories.slice(0, visibleCount).map((c) => {
          const categoryName = c.name.toUpperCase();
          
          return (
            <NavLink
              key={c.id}
              to="/products"
              className="group relative block overflow-hidden border border-gray-800 xs:border-2
                         transition-all duration-500 hover:border-white
                         hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] xs:hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]
                         hover:scale-[1.01] xs:hover:scale-[1.02]"
            >
              {/* Карточка категории */}
              <div className="relative h-[280px] xs:h-[320px] sm:h-[380px] md:h-[450px] lg:h-[500px] overflow-hidden bg-black">
                {/* Фоновое изображение */}
                  <img 
                    src={`http://localhost:3000${c.image_url}`}
                    alt={c.name}
                    className="absolute inset-0 w-full h-full object-cover object-center 
                             transform group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                
                {/* Затемнение поверх изображения */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 z-10" />
                
                {/* Контент по центру */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-2 xs:px-3 sm:px-4">
                  <div className="text-center max-w-full px-2 xs:px-3">
                    <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white 
                                 mb-3 xs:mb-4 tracking-tight xs:tracking-tighter drop-shadow-lg">
                      {categoryName}
                    </h3>
                    
                    {/* Линия под названием */}
                    <div className="h-0.5 w-24 xs:w-28 sm:w-32 bg-gradient-to-r from-transparent via-white to-transparent 
                                  mx-auto mb-4 xs:mb-5 sm:mb-6 group-hover:w-32 xs:group-hover:w-36 sm:group-hover:w-48 transition-all duration-500"></div>
                    
                    <div className="text-gray-300 text-xs xs:text-sm tracking-wider opacity-0 
                                  group-hover:opacity-100 transition-opacity duration-500">
                      СМОТРЕТЬ В КАТАЛОГЕ
                    </div>
                  </div>
                </div>

                {/* Подложка снизу */}
                <div className="absolute bottom-0 left-0 right-0 p-3 xs:p-4 sm:p-5 md:p-6 bg-gradient-to-t from-black/95 to-transparent z-30">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-1 xs:gap-2 text-white/70 group-hover:text-white 
                                  transition-colors duration-300">
                      <span className="text-[10px] xs:text-xs tracking-wider">ПЕРЕЙТИ К ТОВАРАМ</span>
                      <span className="transform group-hover:translate-x-1 xs:group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </div>

                {/* Эффекты углов - скрыть на очень маленьких экранах */}
                <div className="hidden xs:block absolute top-0 left-0 w-4 xs:w-5 sm:w-6 h-4 xs:h-5 sm:h-6 border-t border-l border-gray-700 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="hidden xs:block absolute top-0 right-0 w-4 xs:w-5 sm:w-6 h-4 xs:h-5 sm:h-6 border-t border-r border-gray-700 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="hidden xs:block absolute bottom-0 left-0 w-4 xs:w-5 sm:w-6 h-4 xs:h-5 sm:h-6 border-b border-l border-gray-700 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="hidden xs:block absolute bottom-0 right-0 w-4 xs:w-5 sm:w-6 h-4 xs:h-5 sm:h-6 border-b border-r border-gray-700 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}