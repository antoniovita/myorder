'use client';

import React, { createContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
      console.log('[INIT] Carrinho carregado do localStorage:', JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    console.log('[SYNC] Carrinho salvo no localStorage:', cartItems);
  }, [cartItems]);

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
      console.log('[ADD TO CART] Carrinho atualizado:', updatedCart);
      return updatedCart;
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    setCartItems(prevItems => {
      const updatedCart = prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      console.log('[UPDATE QUANTITY] Carrinho atualizado:', updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => {
      const updatedCart = prevItems.filter(item => item.id !== itemId);
      console.log('[REMOVE ITEM] Carrinho atualizado:', updatedCart);
      return updatedCart;
    });
  };

  const clearCart = () => {
    console.log('[CLEAR CART] Carrinho limpo');
    setCartItems([]);
  };

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
