'use client';

import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export interface Item {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  [key: string]: any;
}

interface CartContextType {
  cartItems: Item[];
  addToCart: (item: Item) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [isInitialized, setIsInitialized] = useState(false); 
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        setCartItems(parsed);
        console.log('[INIT] Carrinho carregado:', parsed);
      }
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      console.log('[SYNC] Carrinho salvo:', cartItems);
    }
  }, [cartItems, isInitialized]);

  const addToCart = (item: Item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      } else {
        updatedCart = [...prevItems, { ...item, quantity: 1 }];
      }
      console.log('[ADD TO CART] Novo estado:', updatedCart);
      return updatedCart;
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    Cookies.remove('cart')
  };

  

  if (!isInitialized) {
    return null;
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
