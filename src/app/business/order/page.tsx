'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
}

interface Table {
  id: string;
  number: number;
  providerId: string;
}

interface Order {
  id: string;
  tableId: string;
  userId: string;
  table: Table;
  user: User;
  price: number;
  status: string;
  providerId: string;
  date: string;
  orderItem: OrderItem[];
}

interface OrderItem {
  id: string;
  itemId: string;
  quantity: number;
  orderId: string;
  observation: string;
  item: Item;
}

interface Item {
  id: string;
  name: string;
  price: number;
  imgUrl: string;
  category: string;
  description: string;
}


const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    v
  );

export default function OrderDashboard() {
  const [orders, setOrders] = useState<(Order & { orderItem: (OrderItem & { item: Item })[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [providerId, setProviderId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const res = await fetch('/api/token', { credentials: 'include' });
        if (!res.ok) throw new Error();
        const { token: tk, id } = await res.json();
        setToken(tk);
        setProviderId(id);
      } catch {
        setError('Erro ao obter credenciais');
      }
    };
    loadAuth();
  }, []);

  useEffect(() => {
    if (!providerId || !token) return;
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`/api/order?providerId=${providerId}`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });
        if (!res.ok) throw new Error();

        const data = await res.json();
        console.log(data);
        const sortedOrders = data.sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setOrders(sortedOrders);
        console.log(sortedOrders);
      } catch {
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [providerId, token]);

  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-60 rounded-2xl" />
        ))}
      </div>
    );

  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {orders.map((order) => (
        <Card key={order.id} className="relative shadow-md hover:shadow-xl transition bg-[#F4ECE3] rounded-xl">
          <CardContent className="space-y-3 p-4">
            <h3 className="text-xl font-bold text-[#5D4037]">{order.user.name}</h3>
            <p className="text-md text-[#8D6E63]">Mesa {order.table.number}</p>

            <div className="flex flex-wrap gap-2">
              {order.orderItem.map((item) => (
                <Card key={item.id} className="p-2 flex flex-col items-center bg-white shadow-sm rounded-lg">
                  <Image
                    src={item.item.imgUrl}
                    alt={item.item.name}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-[#D7CCC8]"
                  />
                  <p className="text-xs text-center text-[#6D4C41] font-medium mt-1">
                    {item.item.name}
                  </p>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-[#8D6E63]">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(order.date).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <ShoppingCart className="w-5 h-5" />
            </div>

            <div className="absolute bottom-3 right-4 text-lg font-bold text-[#4E342E]">
              {formatBRL(order.price)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}