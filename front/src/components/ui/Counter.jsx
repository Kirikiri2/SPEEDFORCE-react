import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../stores/stores";

export default function Counter({ quantity, id }) {
  const [number, setNumber] = useState(quantity);
  const [cart, setCart] = useContext(CartContext);

  function changeQuantity(id, newQuantity) {
    if (newQuantity === 0) {
      setCart(cart.filter(element => element.id !== id));
    } else {
      setCart(
        cart.map(element => {
          if (element.id === id) {
            return { ...element, quantity: newQuantity };
          }
          return element;
        })
      );
    }
  }

  function increment() {
    if (number < 99) {
      setNumber(number + 1);
    }
  }

  function decrement() {
    if (number > 1) {
      setNumber(number - 1);
    } else if (number === 1) {
      setNumber(0);
    }
  }

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 99) {
      setNumber(value);
    }
  };

  useEffect(() => {
    changeQuantity(id, number);
  }, [number]);

  return (
    <div className="flex items-center bg-black/30 rounded-xl border border-[var(--color-main-soft)] overflow-hidden">
      <button
        onClick={decrement}
        className="w-10 h-10 flex items-center justify-center 
                 bg-gradient-to-r from-[var(--color-main-soft)] to-transparent
                 text-white hover:bg-[var(--color-main)] transition-colors duration-200
                 text-xl font-bold"
        disabled={number === 0}
      >
        −
      </button>
      
      <div className="w-16 flex items-center justify-center">
        <input
          type="number"
          value={number}
          onChange={handleInputChange}
          min="0"
          max="99"
          className="w-full text-center bg-transparent text-white font-bold
                   focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                   [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      
      <button
        onClick={increment}
        className="w-10 h-10 flex items-center justify-center 
                 bg-gradient-to-r from-[var(--color-main-soft)] to-transparent
                 text-white hover:bg-[var(--color-main)] transition-colors duration-200
                 text-xl font-bold"
        disabled={number >= 99}
      >
        +
      </button>
    </div>
  );
}