'use client';

import { useCart } from '@/hooks/useCart';
import Image from 'next/image';

const CartPage = () => {
  const { cartItems } = useCart();

  const total = cartItems.reduce((acc, item) => acc + item.price * (item.quantity ?? 1), 0);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Seu Carrinho</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">O carrinho está vazio.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white rounded-xl shadow p-4 border border-gray-200"
            >
              <div className="relative w-20 h-20 rounded overflow-hidden mr-4">
                <Image
                  src={item.imgUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                <p className="text-sm text-gray-600">
                  R$ {item.price.toFixed(2)} x {item.quantity} ={' '}
                  <span className="font-medium text-blue-600">
                    R$ {(item.price * (item.quantity ?? 1)).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          ))}

          <div className="text-right mt-6 border-t pt-4">
            <p className="text-xl font-bold text-blue-700">
              Total: <span className="text-green-600">R$ {total.toFixed(2)}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
