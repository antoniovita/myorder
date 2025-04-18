'use client';

import { useEffect, useState } from 'react';
import { Clock, ShoppingCart, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

const statusStyle = (status: string) => {
  switch (status) {
    case 'ativo':
      return 'bg-green-600 text-white';
    case 'finalizado':
      return 'bg-yellow-500 text-white';
    case 'cancelado':
      return 'bg-red-600 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function OrderDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [providerId, setProviderId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

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
        const sortedOrders = data.sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setOrders(sortedOrders);
      } catch {
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [providerId, token]);

  const handleDeleteOrder = async () => {
    if (!token || !orderToDelete) return;
    try {
      const res = await fetch(`/api/order?id=${orderToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erro ao cancelar pedido');
      setOrders((prev) => prev.filter((order) => order.id !== orderToDelete));
      setOrderToDelete(null);
    } catch (error) {
      setError('Erro ao cancelar pedido');
    }
  };

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {orders.map((order) => (
        <Dialog key={order.id}>
          <DialogTrigger asChild>
            <Card className="bg-white shadow rounded-lg p-4 cursor-pointer transition relative">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-semibold">{order.user.name}</h3>
                    <p className="text-sm text-gray-500">Mesa {order.table.number}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setOrderToDelete(order.id); }}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className={`px-2 py-1 rounded-full text-xs ${statusStyle(order.status)}`}>Pedido {order.status}</span>
                <span className="text-lg font-medium">{formatBRL(order.price)}</span>
              </div>
            </Card>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido</DialogTitle>
              <DialogDescription>
                <strong>{order.user.name}</strong> - Mesa {order.table.number}
              </DialogDescription>
            </DialogHeader>
            {order.orderItem.map((item) => (
              <div key={item.id} className="border-b py-2">
                <p className="font-semibold">{item.item.name} (x{item.quantity})</p>
                <p className="text-sm text-gray-600">Observação: {item.observation || 'Nenhuma'}</p>
              </div>
            ))}
          </DialogContent>
        </Dialog>
      ))}

      <Dialog open={!!orderToDelete} onOpenChange={() => setOrderToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmação</DialogTitle>
            <DialogDescription>Tem certeza que deseja cancelar este pedido?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className='hover:cursor-pointer' variant="secondary" onClick={() => setOrderToDelete(null)}>Não</Button>
            <Button variant="destructive" className='hover:cursor-pointer' onClick={handleDeleteOrder}>Sim, cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
