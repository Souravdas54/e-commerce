import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartContextType {
  cartCount: number;
  updateCartCount: () => void;
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  updateCartCount: () => {}
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const calculateTotal = () => {
    const cat = parseInt(localStorage.getItem('cat_products_cart_count') || '0');
    const dog = parseInt(localStorage.getItem('dog_products_cart_count') || '0');
    const fish = parseInt(localStorage.getItem('fish_products_cart_count') || '0');
    const bird = parseInt(localStorage.getItem('bird_products_cart_count') || '0');
    const smallanimal = parseInt(localStorage.getItem('small_animal_products_cart_count') || '0');
    const reptiles = parseInt(localStorage.getItem('reptile_products_cart_count') || '0');

    return cat + dog + fish + bird + smallanimal + reptiles;
  };

  const updateCartCount = () => {
    setCartCount(calculateTotal());
  };

  useEffect(() => {
    updateCartCount(); // Initial count
    
    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);