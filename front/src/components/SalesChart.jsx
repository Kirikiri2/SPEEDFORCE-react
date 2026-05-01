import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

// Цвета в стиле SpeedForce - градиенты изумрудных оттенков
const COLORS = [
  "#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899",
  "#14b8a6", "#3b82f6", "#a855f7", "#f97316", "#dc2626", "#d946ef",
  "#06b6d4", "#6366f1", "#d946ef", "#f43f5e"
].map(color => ({
  solid: color,
  gradient: `linear-gradient(135deg, ${color}, ${color}80)`
}));

export default function SalesChart() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("bar");
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsSmallScreen(width < 640);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    async function loadSales() {
      try {
        const resSales = await axios.get("http://localhost:3000/api/sales");
        const resProducts = await axios.get("http://localhost:3000/api/products");

        const productsMap = {};
        resProducts.data.data.forEach((p) => {
          productsMap[p.id] = p.name;
        });

        const grouped = {};
        resSales.data.data.forEach((sale) => {
          if (!grouped[sale.product_id]) grouped[sale.product_id] = 0;
          grouped[sale.product_id] += sale.total_price;
        });

        const chartData = Object.keys(grouped)
          .map((productId) => {
            const fullName = productsMap[productId] || `PRODUCT #${productId}`;
            return {
              name: fullName,
              value: grouped[productId],
              displayName: fullName
            };
          })
          .sort((a, b) => b.value - a.value);

        setSales(chartData);
      } catch (err) {
        console.error("Ошибка загрузки диаграммы:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSales();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[300px] sm:h-[400px] md:h-[500px] border border-emerald-500/20 rounded-xl bg-black/50 backdrop-blur-sm relative overflow-hidden">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-gradient-to-l from-emerald-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-2 border-emerald-500 border-t-transparent mb-4"></div>
        <p className="text-gray-400 text-sm sm:text-base tracking-wider">ЗАГРУЗКА ДАННЫХ...</p>
        <p className="text-emerald-500/50 text-xs mt-2">SPEEDFORCE ANALYTICS</p>
      </div>
    </div>
  );

  if (sales.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] md:h-[500px] border border-emerald-500/20 rounded-xl bg-black/50 backdrop-blur-sm p-6 relative">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 -right-20 w-64 h-64 bg-gradient-to-l from-emerald-500/5 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 text-center">
        <div className="text-4xl sm:text-5xl mb-4">📊</div>
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mb-4"></div>
        <p className="text-white text-lg sm:text-xl font-bold mb-2">НЕТ ДАННЫХ О ПРОДАЖАХ</p>
        <p className="text-gray-400 text-sm">ОЖИДАЙТЕ ПОСТУПЛЕНИЯ ИНФОРМАЦИИ</p>
        <div className="mt-6">
          <div className="inline-flex items-center gap-2 text-emerald-500/70 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>SPEEDFORCE ANALYTICS</span>
          </div>
        </div>
      </div>
    </div>
  );

  const totalValue = sales.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full bg-black/60 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl shadow-emerald-500/5 relative overflow-hidden">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-bl from-emerald-500/3 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-emerald-500/3 to-transparent rounded-full blur-3xl"></div>
        
        {/* Сетка */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(to right, #10b981 0.5px, transparent 0.5px),
                             linear-gradient(to bottom, #10b981 0.5px, transparent 0.5px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Заголовок */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-400"></div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    АНАЛИТИКА
                  </span>
                  <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                    ПРОДАЖ
                  </span>
                </h2>
              </div>
              <p className="text-gray-400 text-sm">
                {isMobile ? "АНАЛИЗ ДОХОДОВ" : "АНАЛИЗ ДОХОДОВ ПО ТОВАРАМ В РЕАЛЬНОМ ВРЕМЕНИ"}
              </p>
            </div>
            
            {/* Переключатель типа диаграммы */}
            <div className="flex justify-center sm:justify-start">
              <div className="inline-flex bg-black/50 backdrop-blur-sm border border-emerald-500/20 rounded-lg overflow-hidden">
                <button
                  onClick={() => setChartType("pie")}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    chartType === "pie" 
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-black/80'
                  }`}
                >
                  <span>{isMobile ? "КРУГ" : "КРУГОВАЯ"}</span>
                </button>
                <button
                  onClick={() => setChartType("bar")}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    chartType === "bar" 
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-black/80'
                  }`}
                >
                  <span>{isMobile ? "СТОЛБ" : "СТОЛБЧАТАЯ"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Диаграмма */}
        <div className="h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] mb-6 sm:mb-8">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "pie" ? (
              <PieChart>
                <defs>
                  {sales.map((entry, index) => (
                    <linearGradient key={index} id={`color${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={COLORS[index % COLORS.length].solid} stopOpacity={0.9}/>
                      <stop offset="100%" stopColor={COLORS[index % COLORS.length].solid} stopOpacity={0.6}/>
                    </linearGradient>
                  ))}
                </defs>
                
                <Pie
                  data={sales}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 40 : 60}
                  outerRadius={isMobile ? 80 : 100}
                  paddingAngle={2}
                  label={isMobile ? false : ({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  stroke="#000"
                  strokeWidth={1}
                >
                  {sales.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={`url(#color${index})`}
                    />
                  ))}
                </Pie>

<Tooltip 
  formatter={(value) => [`${value.toLocaleString()} ₽`, 'ДОХОД']}
  contentStyle={{
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(16, 185, 129, 0.4)',
    borderRadius: '8px',
    color: '#FFFFFF', // Белый цвет текста
    fontSize: isMobile ? '12px' : '14px',
    padding: isMobile ? '8px' : '12px',
    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.2)'
  }}
  labelStyle={{ 
    fontWeight: 'bold',
    fontSize: isMobile ? '12px' : '14px',
    color: '#FFFFFF', // Белый цвет для заголовка
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px'
  }}
  itemStyle={{
    color: '#FFFFFF', // Белый цвет для элементов
    padding: '4px 0'
  }}
  wrapperStyle={{
    color: '#FFFFFF' // Белый цвет для обертки
  }}
/>
                
                {!isMobile && (
                  <Legend 
                    layout={isSmallScreen ? "vertical" : "vertical"}
                    verticalAlign={isSmallScreen ? "bottom" : "middle"}
                    align={isSmallScreen ? "center" : "right"}
                    wrapperStyle={{ 
                      color: 'white',
                      fontSize: isSmallScreen ? '10px' : '12px',
                      padding: isSmallScreen ? '10px 0 0 0' : '0 10px'
                    }}
                    formatter={(value) => {
                      const displayName = value.length > 20 ? value.substring(0, 20) + "..." : value;
                      return <span className="text-gray-300">{displayName}</span>;
                    }}
                  />
                )}
              </PieChart>
            ) : (
              <BarChart 
                data={sales} 
                margin={{ 
                  top: 20, 
                  right: isMobile ? 10 : 30, 
                  left: isMobile ? 10 : 20, 
                  bottom: isMobile ? 60 : 80 
                }}
              >
                <defs>
                  {sales.map((entry, index) => (
                    <linearGradient key={index} id={`barColor${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS[index % COLORS.length].solid} stopOpacity={0.9}/>
                      <stop offset="100%" stopColor={COLORS[index % COLORS.length].solid} stopOpacity={0.4}/>
                    </linearGradient>
                  ))}
                </defs>
                
                <CartesianGrid stroke="rgba(16, 185, 129, 0.1)" strokeDasharray="3 3" />
                
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ 
                    fill: '#999', 
                    fontSize: isMobile ? 9 : isSmallScreen ? 10 : 11
                  }}
                  angle={isMobile ? -90 : -45}
                  textAnchor="end"
                  height={isMobile ? 50 : isSmallScreen ? 60 : 80}
                  interval={0}
                  tickFormatter={(value) => {
                    if (value.length > (isMobile ? 6 : isSmallScreen ? 10 : 12)) {
                      return value.substring(0, isMobile ? 6 : isSmallScreen ? 10 : 12) + "...";
                    }
                    return value;
                  }}
                />
                
                <YAxis 
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ 
                    fill: '#999', 
                    fontSize: isMobile ? 9 : 11
                  }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${(value/1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value/1000).toFixed(0)}K`;
                    return value;
                  }}
                  width={isMobile ? 40 : 60}
                />
                
               <Tooltip 
  formatter={(value) => [`${value.toLocaleString()} ₽`, 'ДОХОД']}
  contentStyle={{
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(16, 185, 129, 0.4)',
    borderRadius: '8px',
    color: '#FFFFFF', // Белый цвет текста
    fontSize: isMobile ? '12px' : '14px',
    padding: isMobile ? '8px' : '12px',
    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.2)'
  }}
  labelStyle={{ 
    fontWeight: 'bold',
    fontSize: isMobile ? '12px' : '14px',
    color: '#FFFFFF', // Белый цвет для заголовка
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px'
  }}
  itemStyle={{
    color: '#FFFFFF', // Белый цвет для элементов
    padding: '4px 0'
  }}
  wrapperStyle={{
    color: '#FFFFFF' // Белый цвет для обертки
  }}
/>
                
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                >
                  {sales.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={`url(#barColor${index})`}
                      stroke={COLORS[index % COLORS.length].solid}
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
                
                {!isMobile && (
                  <Legend 
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ 
                      color: 'white',
                      fontSize: isSmallScreen ? '10px' : '11px',
                      padding: '10px 0 0 0'
                    }}
                    formatter={(value, entry, index) => (
                      <span className="inline-flex items-center gap-2 px-2">
                        <span 
                          className="inline-block w-2 h-2 rounded-full"
                          style={{ 
                            backgroundColor: COLORS[index % COLORS.length].solid,
                            boxShadow: `0 0 6px ${COLORS[index % COLORS.length].solid}`
                          }}
                        />
                        <span className="text-gray-300">
                          {value.length > (isSmallScreen ? 8 : 12) 
                            ? value.substring(0, isSmallScreen ? 8 : 12) + "..."
                            : value
                          }
                        </span>
                      </span>
                    )}
                  />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Статистические карточки */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black/40 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4 sm:p-6 hover:border-emerald-500/30 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-emerald-400">📦</span>
                </div>
                <div className="text-gray-400 text-sm">ТОВАРОВ</div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white">{sales.length}</div>
              <div className="mt-2 text-xs text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                в каталоге
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4 sm:p-6 hover:border-emerald-500/30 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-emerald-400">💰</span>
                </div>
                <div className="text-gray-400 text-sm">ОБЩИЙ ДОХОД</div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {totalValue >= 1000000 
                  ? `${(totalValue/1000000).toFixed(1)}M`
                  : totalValue >= 1000
                  ? `${(totalValue/1000).toFixed(0)}K`
                  : totalValue.toLocaleString()
                } ₽
              </div>
              <div className="mt-2 text-xs text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                совокупно
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4 sm:p-6 hover:border-emerald-500/30 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-emerald-400">📊</span>
                </div>
                <div className="text-gray-400 text-sm">СРЕДНИЙ ЧЕК</div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {Math.round(totalValue / sales.length).toLocaleString()} ₽
              </div>
              <div className="mt-2 text-xs text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                на товар
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4 sm:p-6 hover:border-emerald-500/30 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-emerald-400">🏆</span>
                </div>
                <div className="text-gray-400 text-sm">ТОП ПРОДАЖ</div>
              </div>
              <div className="text-lg sm:text-xl font-bold text-white truncate">
                {sales[0]?.name}
              </div>
              <div className="mt-2 text-xs text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                лидер продаж
              </div>
            </div>
          </div>
        </div>

        {/* Таблица данных */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {isMobile ? "ДЕТАЛИ" : "ДЕТАЛЬНЫЙ ОТЧЕТ"}
            </h3>
          </div>
          
          <div className="relative overflow-hidden border border-emerald-500/20 rounded-xl">
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="bg-black/40 backdrop-blur-sm">
                  {/* Заголовок таблицы */}
                  <div className="grid grid-cols-12 gap-4 p-4 border-b border-emerald-500/10">
                    <div className="col-span-1 text-gray-400 text-sm font-semibold">#</div>
                    <div className="col-span-5 text-gray-400 text-sm font-semibold">ТОВАР</div>
                    <div className="col-span-3 text-gray-400 text-sm font-semibold">ДОХОД</div>
                    <div className="col-span-3 text-gray-400 text-sm font-semibold">ДОЛЯ</div>
                  </div>
                  
                  {/* Данные */}
                  {sales.map((item, index) => {
                    const percentage = ((item.value / totalValue) * 100).toFixed(1);
                    const color = COLORS[index % COLORS.length];
                    
                    return (
                      <div 
                        key={index} 
                        className="grid grid-cols-12 gap-4 p-4 border-b border-emerald-500/5 hover:bg-black/60 transition-all duration-300 group"
                      >
                        <div className="col-span-1 flex items-center">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded"
                              style={{ 
                                background: color.gradient,
                                boxShadow: `0 0 8px ${color.solid}40`
                              }}
                            />
                            <span className="text-white font-bold">{index + 1}</span>
                          </div>
                        </div>
                        
                        <div className="col-span-5">
                          <div className="text-white text-sm line-clamp-2">
                            {item.displayName}
                          </div>
                        </div>
                        
                        <div className="col-span-3">
                          <div className="text-white font-semibold">
                            {item.value.toLocaleString()} ₽
                          </div>
                          <div className="text-gray-400 text-xs">
                            {percentage}% от общего
                          </div>
                        </div>
                        
                        <div className="col-span-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${percentage}%`,
                                  background: color.gradient,
                                  boxShadow: `0 0 4px ${color.solid}`
                                }}
                              ></div>
                            </div>
                            <span className="text-white font-bold text-sm min-w-[45px]">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Индикатор скролла */}
            {isMobile && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-emerald-400/70 text-xs">
                    <span className="animate-pulse">←</span>
                    <span>ПРОКРУТИТЕ ДЛЯ ПРОСМОТРА</span>
                    <span className="animate-pulse">→</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Легенда */}
        <div className="border-t border-emerald-500/20 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="text-gray-400 text-sm font-semibold">ЛЕГЕНДА:</div>
            <div className="text-emerald-400 text-xs">
              Всего записей: <span className="text-white font-bold">{sales.length}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {sales.slice(0, isMobile ? 3 : 6).map((item, index) => {
              const color = COLORS[index % COLORS.length];
              return (
                <div 
                  key={index} 
                  className="flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-sm border border-emerald-500/10 rounded-lg hover:border-emerald-500/30 transition-all duration-300"
                >
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ 
                      background: color.gradient,
                      boxShadow: `0 0 6px ${color.solid}40`
                    }}
                  />
                  <span className="text-white text-xs font-medium">
                    {index + 1}. {item.displayName.split(' ')[0]}
                  </span>
                  <span className="text-emerald-400 text-xs font-bold">
                    {((item.value / totalValue) * 100).toFixed(1)}%
                  </span>
                </div>
              );
            })}
            
            {sales.length > (isMobile ? 3 : 6) && (
              <div className="flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-sm border border-emerald-500/10 rounded-lg">
                <span className="text-gray-500 text-xs">
                  +{sales.length - (isMobile ? 3 : 6)} позиций
                </span>
              </div>
            )}
          </div>
          
          {/* Футер */}
          <div className="mt-6 pt-4 border-t border-emerald-500/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-gray-500 text-xs">
                Обновлено: {new Date().toLocaleTimeString('ru-RU', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-emerald-400/70 text-xs">SPEEDFORCE ANALYTICS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}