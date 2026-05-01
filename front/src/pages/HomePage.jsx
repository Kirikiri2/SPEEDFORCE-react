import { NavLink } from "react-router";
import ShopsList from "../components/ShopList";
import CategoriesList from "../components/CategoriesList";

export default function HomePage() {
  const useCases = [
    {
      title: "Деловые поездки",
      description: "Стильные седаны для встреч и переговоров",
      image: "./rek1.jpg",
      features: ["Wi-Fi роутер", "Рабочее пространство", "Конфиденциальность"],
      color: "emerald"
    },
    {
      title: "Городская мобильность",
      description: "Компактные авто для ежедневных задач",
      image: "./rek2.jpg",
      features: ["Парктроники", "Экономичность", "Маневренность"],
      color: "emerald"
    },
    {
      title: "Семейные выходные",
      description: "Просторные SUV для комфортных поездок",
      image: "./rek3.jpg",
      features: ["Детские кресла", "Большой багажник", "Мультимедиа"],
      color: "emerald"
    },
    {
      title: "Дальние путешествия",
      description: "Надежные внедорожники для любых дорог",
      image: "./rek4.jpg",
      features: ["Полный привод", "Доп. топливо", "Навигация"],
      color: "emerald"
    }
  ];



  return (
    <div className="w-full  bg-black text-white min-h-screen">
{/* Hero секция */}
<div className="relative w-full min-h-screen flex items-center justify-center px-4 lg:px-12 pt-20 overflow-hidden">
  {/* Фоновое изображение */}
  <div className="absolute inset-0 z-0">
    <img 
      src="./road.jpg" 
      alt="Дорога - фон SpeedForce" 
      className="w-full h-full object-cover"
    />
    {/* Темное наложение для улучшения читаемости текста */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/60"></div>
    {/* Дополнительный градиент для глубины */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
  </div>
  
  {/* Фоновые элементы поверх изображения */}
  <div className="absolute top-1/4 -right-20 w-96 h-96 bg-gradient-to-l from-emerald-500/15 to-transparent rounded-full blur-3xl z-10"></div>
  <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-full blur-3xl z-10"></div>
  
  {/* Эффект движения дороги */}
  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10"></div>
  
  {/* Сетка на заднем плане */}
  <div className="absolute inset-0 opacity-10">
    <div className="h-full w-full" style={{
      backgroundImage: `linear-gradient(to right, #10b981 0.5px, transparent 0.5px),
                       linear-gradient(to bottom, #10b981 0.5px, transparent 0.5px)`,
      backgroundSize: '40px 40px'
    }}></div>
  </div>
  
  {/* Эффектные линии */}
  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent z-10"></div>
  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent z-10"></div>
  
  <div className="w-full max-w-7xl relative z-20">
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Текст */}
      <div className="space-y-8">
        {/* Логотип */}
        <div className="flex items-center gap-3 mb-8">
          
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight font-(family-name:--font-title) ">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              SPEED
            </span>
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              FORCE
            </span>
          </h1>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="text-gray-200">Аренда </span>
            <span className="text-white">автомобилей</span>
            <br />
            <span className="text-emerald-400">премиум-класса</span>
          </h2>
          
          <p className="text-xl text-gray-300 leading-relaxed max-w-xl drop-shadow-lg">
            Для бизнеса, путешествий и повседневных задач. 
            Современный флот, цифровой сервис и гарантия качества.
          </p>
        </div>

        {/* Ключевые показатели */}
        <div className="grid grid-cols-3 gap-6 py-8 backdrop-blur-sm bg-black/30 rounded-xl border border-emerald-500/10 p-4">
          <div className="text-center border-r border-emerald-500/20">
            <div className="text-3xl font-bold text-white mb-2 drop-shadow-lg">500+</div>
            <div className="text-sm text-emerald-300">Авто в парке</div>
          </div>
          <div className="text-center border-r border-emerald-500/20">
            <div className="text-3xl font-bold text-white mb-2 drop-shadow-lg">24/7</div>
            <div className="text-sm text-emerald-300">Поддержка</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2 drop-shadow-lg">50+</div>
            <div className="text-sm text-emerald-300">Городов</div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <NavLink
            to="/products"
            className="group relative bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 font-semibold text-lg rounded-lg hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            <span className="relative z-10">Выбрать автомобиль</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </NavLink>

        </div>
      </div>


    </div>
  </div>
</div>

      {/* Категории */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-emerald-400 mb-4">
              <div className="w-12 h-px bg-emerald-500"></div>
              <span className="text-sm font-semibold tracking-wider">КАТЕГОРИИ</span>
              <div className="w-12 h-px bg-emerald-500"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Автомобили для <span className="text-emerald-400">любых задач</span>
            </h2>
          </div>
          <CategoriesList visible={'all'} />
        </div>
      </div>

      {/* Примеры использования */}
      <div className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Идеальный автомобиль <br />
              <span className="text-gray-300">для каждой ситуации</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Мы подбираем авто не только по техническим характеристикам, 
              но и по назначению использования
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="group">
                <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-gray-900 hover:border-white/60 transition-all duration-500">
                  {/* Изображение - минималистичный заголовок поверх */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={useCase.image} 
                      alt={useCase.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Минималистичный заголовок */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{useCase.title}</h3>
                      <p className="text-gray-300 text-sm">{useCase.description}</p>
                    </div>
                  </div>
                  
                  {/* Контент - только особенности */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {useCase.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <NavLink 
                      to={`/catalog?category=${useCase.title.toLowerCase()}`}
                      className="inline-flex items-center gap-2 text-white hover:text-emerald-400 font-semibold mt-6 group/link text-sm"
                    >
                      Смотреть варианты
                      <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Секция с магазинами */}
      <div className="py-20 px-4 border-t border-gray-800 bg-linear-to-b from-gray-900 to-black ">
        <div className="max-w-7xl mx-auto">
          <ShopsList />
        </div>
      </div>

      {/* Финальный CTA */}
      <div className="pt-2 pb-25 px-4 bg-black ">
        <div className="max-w-4xl mx-auto relative shadow-2xl shadow-emerald-500/20">
          <div className="relative bg-gray-900 rounded-xl p-8 md:p-12 text-center border border-gray-800">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Готовы начать?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Выберите автомобиль и получите первый час аренды в подарок
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink
                to="/products"
                className="group relative bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 font-semibold text-lg rounded-lg hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  Выбрать автомобиль
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </NavLink>
              
              <NavLink
                to="/contact"
                className="bg-transparent text-white px-8 py-4 font-semibold text-lg rounded-lg border border-gray-700 hover:border-white/60 transition-all duration-300"
              >
                Связаться с нами
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}