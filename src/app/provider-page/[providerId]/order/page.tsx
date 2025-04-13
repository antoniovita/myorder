'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

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
        if (!res.ok) {
          throw new Error('Erro ao buscar pedidos');
        }

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
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pb-28">
      <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">Histórico de Pedidos</h1>

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
                key={order.id}
                className="border border-gray-200 rounded-2xl p-6 shadow-sm bg-white hover:shadow-md transition duration-200 cursor-pointer"
                onClick={() => toggleOrder(order.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Data do pedido</span>
                  <span className="text-sm font-medium text-gray-800">
                    {new Date(order.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className="font-semibold text-blue-600 capitalize">{order.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Total</p>
                    <p className="text-lg font-bold text-green-700">R$ {order.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Itens do pedido */}
                {isExpanded && (
                  <div className="mt-6 border-t pt-4 space-y-4">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Itens do Pedido:</h3>
                    {order.orderItem.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center bg-gray-50 rounded-xl p-4 shadow-sm"
                      >
                        <img
                          src={item.item.imgUrl}
                          alt={item.item.name}
                          className="w-16 h-16 object-cover rounded-lg mr-4 border"
                        />
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{item.item.name}</p>
                          <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-700 font-semibold">R$ {item.item.price.toFixed(2)}</p>
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
