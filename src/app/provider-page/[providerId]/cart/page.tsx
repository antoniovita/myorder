'use client';

import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Cookies from 'js-cookie';
import React from 'react';

const CartPage = () => {
  const { cartItems, updateCartQuantity, removeFromCart, clearCart } = useCart();
  const [observations, setObservations] = React.useState<{ [key: string]: string }>({});

  const handleQuantityChange = (itemId: string, delta: number) => {
    const currentItem = cartItems.find(item => item.id === itemId);
    if (!currentItem) return;

    const newQty = Math.max(1, (currentItem.quantity || 1) + delta);
    updateCartQuantity(itemId, newQty);
  };

  const handleDeleteItem = (itemId: string) => {
    removeFromCart(itemId);
    setObservations(prev => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  };

  const handleObservationChange = (itemId: string, text: string) => {
    setObservations(prev => ({
      ...prev,
      [itemId]: text,
    }));
  };

  const createOrder = async () => {
    try {
      const total = cartItems.reduce(
        (acc, item) => acc + item.price * (item.quantity ?? 1),
        0
      );

      if (cartItems.length === 0) {
        return console.log('Não se pode criar order sem items.');
      }

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: total,
          tableId: Cookies.get('tableId'),
          userId: Cookies.get('userId'),
          providerId: Cookies.get('providerId'),
          status: 'ativo',
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar pedido');
      }

      const data = await response.json();
      const order = data.order;
      console.log('Pedido criado:', order);

      for (const item of cartItems) {
        console.log('[DEBUG] Processando item:', item);
        console.log('[DEBUG] item.id:', item.id);
        console.log('[DEBUG] observation:', observations[item.id]);

        const orderItemPayload = {
          itemId: item.id,
          quantity: item.quantity || 1,
          orderId: order.id,
          observation: observations[item.id] || '',
        };

        console.log(`Enviando item do pedido para API /api/orderItem:`, orderItemPayload);

        const itemResponse = await fetch('/api/orderItem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderItemPayload),
        });

        if (!itemResponse.ok) {
          throw new Error(`Erro ao criar item do pedido: ${item.id}`);
        }
      }

      console.log('Itens do pedido criados.');
      clearCart();
      setObservations({});
    } catch (error) {
      console.error('Erro na criação do pedido:', error);
      alert('Erro ao criar pedido');
    }
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity ?? 1),
    0
  );

  const formatBRL = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(v);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 sm:pb-0">
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center text-base sm:text-lg">O carrinho está vazio.</p>
      ) : (
        <div className="space-y-5 sm:space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-2 sm:gap-6 bg-white sm:p-4 border-gray-200 border-b sm:border-0"
            >
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="absolute top-3 sm:right-5 right-2 p-1 hover:cursor-pointer text-red-500 transition"
              >
                <Trash2 size={18} />
              </button>

              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden border border-gray-100">
                <Image src={item.imgUrl} alt={item.name} fill className="object-cover" />
              </div>

              <div className="flex-1 w-full space-y-2">
                <div>
                  <h2 className="text-[15px] sm:text-lg font-medium text-gray-800">{item.name}</h2>
                  {item.description && (
                    <p className="text-[12px] max-w-[300px] sm:text-sm sm:max-w-[1000px] text-gray-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <textarea
                  placeholder="Adicionar observação (ex: sem cebola)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={observations[item.id] || ''}
                  onChange={(e) => handleObservationChange(item.id, e.target.value)}
                />

                <div className="flex flex-row items-center justify-between gap-3">
                  <div className="flex items-center rounded-xl bg-gray-100 overflow-hidden">
                    <button
                      className="px-3 py-1 text-gray-700 hover:cursor-pointer transition"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 py-1 text-sm font-medium text-gray-800 bg-transparent">
                      {item.quantity || 1}
                    </span>
                    <button
                      className="px-3 py-1 text-gray-700 hover:cursor-pointer transition"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-right text-gray-700 py-2 px-3">
                    <span className="text-gray-500 font-light text-[12px]">
                      {formatBRL(item.price)} x {item.quantity}
                    </span>
                    <br />
                    <span className="font-normal text-[18px] sm:text-lg text-gray-900">
                      {formatBRL(item.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="hidden sm:flex mt-10 border-t pt-5 items-center justify-between">
            <p className="text-xl font-normal text-gray-900">
              Total: <span className="font-bold">{formatBRL(total)}</span>
            </p>
            <button
              onClick={createOrder}
              className="bg-blue-500 hover:bg-blue-600 transition font-bold hover:cursor-pointer text-white px-6 py-3 rounded-xl text-base"
            >
              Finalizar Pedido
            </button>
          </div>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-4 flex items-center justify-between shadow-md">
          <p className="text-lg font-normal text-gray-900">
            Total: <span className="font-bold">{formatBRL(total)}</span>
          </p>
          <button
            onClick={createOrder}
            className="bg-blue-500 hover:bg-blue-600 hover:cursor-pointer transition text-white  px-10 py-2.5 rounded-xl font-bold text-md"
          >
            Finalizar
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
