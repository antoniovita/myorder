'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ClipboardList } from 'lucide-react';
import Image from 'next/image';

interface Item {
  id: string;
  name: string;
  price: number;
  imgUrl: string;
  category: string;
  description: string;
}

interface OrderItem {
  id: string;
  name: string;
  imgUrl: string;
  quantity: number;
  price: number;
  item: Item;
  observation: string;
}

interface Order {
  id: string;
  price: number;
  status: string;
  date: string;
  orderItem: OrderItem[];
}

const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = Cookies.get('userId');
      if (!userId) {
        console.error('userId não encontrado nos cookies');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/order?userId=${userId}`);
        if (!res.ok) throw new Error('Erro ao buscar pedidos');
        const data = await res.json();
        setOrders(data || []);

        data.forEach((order: Order) => {
          console.log(`Itens do pedido ${order.id}:`, order.orderItem);
        });
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const formatBRL = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">

      {loading ? (
        <p className="text-gray-500 text-center">Carregando...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center">Você ainda não fez nenhum pedido.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrders.includes(order.id);
            return (
              <div
                onClick={() => toggleOrder(order.id)}
                key={order.id}
                className="border-b border-gray-200 p-6 bg-gray-white transition duration-200 cursor-pointer"
              >
                <div
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <ClipboardList className="w-8 h-8 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Data do pedido</p>
                      <p className="font-medium text-gray-800">
                        {new Date(order.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-lg font-normal text-black">
                        {formatBRL(order.price)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold text-green-600 capitalize">{order.status}</p>
                </div>

                {isExpanded && (
                  <div className="mt-6 border-t pt-4 space-y-4 transition-all duration-300 ease-in-out">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Itens do Pedido:</h3>
                    {order.orderItem.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center bg-white border border-gray-300 rounded-xl p-3 transition"
                      >
                        <Image
                          width={64}
                          height={64}
                          src={item.item.imgUrl}
                          alt={item.item.name}
                          className="w-16 h-16 object-cover rounded-lg mr-4 border"
                        />
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{item.item.name}</p>
                          <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>

                          {item.observation && item.observation.trim() !== '' && (
                            <p className="text-sm text-gray-700 italic mt-1">Obs: {item.observation}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-black font-semibold">
                            R$ {item.item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
