import { useEffect, useState, useRef } from "react";
import MapBlock from "./MapBlock";

export default function OfficesList() {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const [activeOffice, setActiveOffice] = useState(null);
  const [viewMode, setViewMode] = useState("map"); // "map" или "list"

  useEffect(() => {
    async function fetchOffices() {
      try {
        const res = await fetch("http://localhost:3000/api/shops");
        const json = await res.json();
        setOffices(json.data);
      } catch (err) {
        console.error("Ошибка загрузки офисов:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffices();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <p className="text-emerald-400 text-lg font-semibold tracking-wider">ЗАГРУЗКА ОФИСОВ</p>
        <p className="text-gray-500 text-sm mt-2">Получаем данные о пунктах выдачи...</p>
      </div>
    </div>
  );

  const allMarkers = offices.map(office => ({
    position: [office.latitude, office.longitude],
    title: office.address
  }));

  const focusOnOffice = (office) => {
    setActiveOffice(office.id);
    if (mapRef.current) {
      mapRef.current.flyTo([office.latitude, office.longitude], 15, { duration: 1.5 });
    }
  };

  return (
    <div className="px-3 xs:px-4 sm:px-6 py-8 xs:py-10 sm:py-12 max-w-7xl mx-auto ">
      {/* Заголовок */}
      <div className="mb-10 xs:mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-white tracking-tight font-(family-name:--font-title) ">
            ОФИСЫ <span className="text-emerald-400">SPEEDFORCE</span>
          </h2>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm xs:text-base">
          Получите автомобиль в удобном для вас пункте выдачи по всей России
        </p>
      </div>

      {/* Переключатель вида */}
      <div className="mb-6 xs:mb-8 flex justify-center">
        <div className="inline-flex bg-gray-900/50 rounded-xl border border-gray-800 p-1">
          <button
            onClick={() => setViewMode("map")}
            className={`px-5 xs:px-6 py-2 xs:py-2.5 text-xs xs:text-sm font-medium rounded-lg transition-all duration-300 ${
              viewMode === "map" 
                ? 'bg-emerald-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            НА КАРТЕ
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-5 xs:px-6 py-2 xs:py-2.5 text-xs xs:text-sm font-medium rounded-lg transition-all duration-300 ${
              viewMode === "list" 
                ? 'bg-emerald-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            СПИСКОМ
          </button>
        </div>
      </div>

      {/* Карта */}
      {viewMode === "map" && (
        <div className="mb-8 xs:mb-10">
          <div className="relative rounded-2xl overflow-hidden border border-gray-800 h-[400px] xs:h-[450px] sm:h-[500px]">
            <MapBlock 
              markers={allMarkers} 
              mapRef={mapRef} 
              style={{ 
                filter: 'grayscale(1) contrast(1.1) brightness(0.9)',
                height: '100%'
              }} 
            />
          </div>
        </div>
      )}

      {/* Карточки офисов */}
      <div className={`${viewMode === "map" ? 'grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6' : 'space-y-4 xs:space-y-5 sm:space-y-6'}`}>
        {offices.map(office => (
          <div
            key={office.id}
            className={`group relative bg-gradient-to-br from-gray-900/80 to-black/80 
                     rounded-xl border ${activeOffice === office.id ? 'border-white/60' : 'border-gray-800'} 
                     transition-all duration-300 hover:border-white/60 cursor-pointer
                     hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] backdrop-blur-sm
                     ${viewMode === "list" ? 'flex flex-col xs:flex-row xs:items-center p-4 xs:p-5 sm:p-6' : 'p-4 xs:p-5 sm:p-6'}`}
            onClick={() => {
              focusOnOffice(office);
              if (viewMode === "list") {
                setViewMode("map");
              }
            }}
          >
            {/* Номер офиса */}
            <div className={`${viewMode === "list" ? 'mb-3 xs:mb-0 xs:mr-4 sm:mr-6' : 'mb-4 xs:mb-5'}`}>
              <div className="w-12 h-12 xs:w-14 xs:h-14 bg-gradient-to-br from-gray-900 to-black 
                           border border-gray-800 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-emerald-400 font-bold text-lg xs:text-xl">{office.id}</div>
                  <div className="text-gray-500 text-[8px] xs:text-xs">ОФИС</div>
                </div>
              </div>
            </div>

            {/* Информация об офисе */}
            <div className={`flex-1 ${viewMode === "list" ? 'xs:flex xs:items-center xs:justify-between' : ''}`}>
              <div className={`${viewMode === "list" ? 'xs:flex-1 mb-3 xs:mb-0' : 'mb-4 xs:mb-5'}`}>
                <h3 className="text-base xs:text-lg font-bold text-white mb-2 line-clamp-2">
                  {office.address}
                </h3>
              </div>

              <div className={`${viewMode === "list" ? 'xs:text-right mb-3 xs:mb-0' : 'mb-4 xs:mb-5'}`}>
                <div className="text-white font-bold text-base xs:text-lg">{office.phone}</div>
                <div className="text-gray-400 text-xs xs:text-sm">Телефон офиса</div>
              </div>
            </div>

            {/* Дополнительная информация */}
            <div className={`${viewMode === "list" ? 'xs:ml-4 sm:ml-6 xs:text-right mb-3 xs:mb-0' : 'mb-4 xs:mb-5'}`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="text-emerald-400 text-sm font-medium">24/7</div>
              </div>
              <div className="text-gray-400 text-xs">Круглосуточно</div>
            </div>

            {/* Кнопка навигации */}
            <div className={`${viewMode === "list" ? 'xs:ml-4 sm:ml-6' : ''}`}>
              <button className="w-full xs:w-auto bg-gradient-to-r from-gray-900 to-black text-white 
                               text-xs xs:text-sm py-2.5 xs:py-3 px-4 xs:px-5 rounded-lg border border-gray-800 
                               hover:border-white/60 hover:bg-gray-800/50 transition-all duration-300 
                               flex items-center justify-center xs:justify-start gap-2 group-hover:gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                НА КАРТЕ
              </button>
            </div>

            {/* Эффект выбранного офиса */}
            {activeOffice === office.id && (
              <div className="absolute inset-0 border-2 border-emerald-500/30 pointer-events-none rounded-xl">
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-white/60 rounded-tl"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t border-r border-white/60 rounded-tr"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b border-l border-white/60 rounded-bl"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-white/60 rounded-br"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Статистика офисов */}
      <div className="mt-8 xs:mt-10 sm:mt-12 pt-6 xs:pt-8 border-t border-gray-800">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6">
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-xl border border-gray-800 p-4 xs:p-5 sm:p-6 text-center">
            <div className="text-gray-400 text-xs xs:text-sm mb-2 tracking-wider">ПУНКТОВ ВЫДАЧИ</div>
            <div className="text-white text-3xl xs:text-4xl sm:text-5xl font-bold mb-2">{offices.length}</div>
            <div className="text-emerald-400 text-xs">по всей России</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-xl border border-gray-800 p-4 xs:p-5 sm:p-6 text-center">
            <div className="text-gray-400 text-xs xs:text-sm mb-2 tracking-wider">ГОРОДОВ</div>
            <div className="text-white text-3xl xs:text-4xl sm:text-5xl font-bold mb-2">50+</div>
            <div className="text-emerald-400 text-xs">с нашим присутствием</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-xl border border-gray-800 p-4 xs:p-5 sm:p-6 text-center">
            <div className="text-gray-400 text-xs xs:text-sm mb-2 tracking-wider">РЕЖИМ РАБОТЫ</div>
            <div className="text-white text-3xl xs:text-4xl sm:text-5xl font-bold mb-2">24/7</div>
            <div className="text-emerald-400 text-xs">круглосуточная выдача</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-xl border border-gray-800 p-4 xs:p-5 sm:p-6 text-center">
            <div className="text-gray-400 text-xs xs:text-sm mb-2 tracking-wider">СРЕДНЕЕ ВРЕМЯ</div>
            <div className="text-white text-3xl xs:text-4xl sm:text-5xl font-bold mb-2">15 мин</div>
            <div className="text-emerald-400 text-xs">получение автомобиля</div>
          </div>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="mt-8 xs:mt-10 text-center">
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-xl border border-gray-800 p-4 xs:p-5 sm:p-6 max-w-2xl mx-auto">
          <h3 className="text-lg xs:text-xl font-bold text-white mb-3">КАК ПОЛУЧИТЬ АВТОМОБИЛЬ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 xs:gap-5">
            <div className="text-center p-3 xs:p-4">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-emerald-400 text-lg">1</span>
              </div>
              <div className="text-white text-sm font-medium mb-1">Выберите офис</div>
              <div className="text-gray-400 text-xs">на карте или в списке</div>
            </div>
            <div className="text-center p-3 xs:p-4">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-emerald-400 text-lg">2</span>
              </div>
              <div className="text-white text-sm font-medium mb-1">Забронируйте авто</div>
              <div className="text-gray-400 text-xs">через сайт или приложение</div>
            </div>
            <div className="text-center p-3 xs:p-4">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-emerald-400 text-lg">3</span>
              </div>
              <div className="text-white text-sm font-medium mb-1">Получите ключи</div>
              <div className="text-gray-400 text-xs">в выбранном пункте выдачи</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}