'use client';

import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartPage = () => {
  const { cartItems, updateCartQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (itemId: string, delta: number) => {
    const currentItem = cartItems.find(item => item.id === itemId);
    if (!currentItem) return;

    const newQty = Math.max(1, (currentItem.quantity || 1) + delta);
    updateCartQuantity(itemId, newQty);
  };

  const handleDeleteItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * (item.quantity ?? 1), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pb-28 sm:pb-0">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8">Seu Carrinho</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center text-base sm:text-lg">O carrinho está vazio.</p>
      ) : (
        <div className="space-y-5 sm:space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="relative flex flex-row items-center gap-4 sm:gap-6 bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition"
            >
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 size={18} />
              </button>

              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border border-gray-100">
                <Image
                  src={item.imgUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 w-full">
                <h2 className="text-base sm:text-lg font-medium text-gray-800">{item.name}</h2>
                {item.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                )}

                <div className="mt-2 sm:mt-3 flex flex-row items-center justify-between gap-3">
                  <div className="flex items-center rounded-md border border-gray-300 bg-gray-50 overflow-hidden">
                    <button
                      className="px-3 py-1 text-gray-700 hover:bg-gray-100 transition"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 py-1 text-sm font-medium text-gray-800 bg-white">
                      {item.quantity || 1}
                    </span>
                    <button
                      className="px-3 py-1 text-gray-700 hover:bg-gray-100 transition"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-right text-sm text-gray-700">
                    <span className="text-gray-500">
                      R$ {item.price.toFixed(2)} x {item.quantity}
                    </span>
                    <br />
                    <span className="font-semibold text-gray-900">
                      R$ {(item.price * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="hidden sm:flex mt-10 border-t pt-5 items-center justify-between">
            <p className="text-xl font-semibold text-gray-900">
              Total: <span className="text-blue-600">R$ {total.toFixed(2)}</span>
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg font-medium text-base">
              Finalizar Pedido
            </button>
          </div>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-4 flex items-center justify-between shadow-md">
          <p className="text-lg font-semibold text-gray-900">
            Total: <span className="text-blue-600">R$ {total.toFixed(2)}</span>
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2.5 rounded-lg font-medium text-sm">
            Finalizar
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
