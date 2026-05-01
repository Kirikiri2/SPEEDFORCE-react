import Counter from "./Counter";
import { CartContext } from "../../stores/stores";
import { useContext } from "react";

export default function CartItem({ product }) {
  const [cart, setCart] = useContext(CartContext);

  const removeFromCart = () => {
    if (window.confirm(`УДАЛИТЬ "${product.name}" ИЗ КОРЗИНЫ?`)) {
      setCart(cart.filter(item => item.id !== product.id));
    }
  };

  const totalPrice = product.price * product.quantity;

  return (
    <div className="group bg-gray-900 border-2 border-gray-800 p-4 hover:border-gray-700 
                    transition-all duration-300">
      
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Изображение товара */}
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black border border-gray-800">
            <img 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              src={`http://localhost:3000${product.image_url}`} 
              alt={product.name} 
            />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-black
                         font-bold text-xs flex items-center justify-center border-2 border-black">
            {product.quantity}
          </div>
        </div>

        {/* Информация о товаре */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-white  text-base sm:text-lg mb-1">
                {product.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-gray-400  text-xs border border-gray-700 px-2 py-0.5">
                  {product.category.toUpperCase()}
                </span>
                <span className="text-gray-500  text-xs">
                  SKU: {product.id}
                </span>
              </div>
            </div>
            <button 
              onClick={removeFromCart}
              className="text-gray-500 hover:text-white font-bold text-xl
                       hover:scale-110 transition-all duration-300 w-8 h-8 flex items-center 
                       justify-center hover:bg-gray-800 ml-2"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Счетчик и цена за штуку */}
            <div className="flex items-center gap-4">
              <Counter quantity={product.quantity} id={product.id} />
              <div className="text-white ">
                <div className="text-sm text-gray-400">ЦЕНА ЗА ШТ.</div>
                <div className="text-lg font-bold">{product.price.toLocaleString()} ₽</div>
              </div>
            </div>

            {/* Итоговая цена */}
            <div className="text-right">
              <div className="text-gray-400  text-xs mb-1 tracking-wider">
                ОБЩАЯ СТОИМОСТЬ
              </div>
              <div className="text-2xl font-bold text-white  bg-gray-800 px-4 py-2 border border-gray-700">
                {totalPrice.toLocaleString()} ₽
              </div>
              <div className="text-gray-500  text-xs mt-1">
                {product.price.toLocaleString()} ₽ × {product.quantity} шт.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}