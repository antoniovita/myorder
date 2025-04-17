'use client';

import { useEffect, useState } from 'react';
import {
  ShoppingCart,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton'; // ajuste o path se necessário

/* ---------- types ---------- */
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
}

interface OrderItem {
  id: string;
  itemId: string;
  quantity: number;
  orderId: string;
  observation: string;
}

/* ---------- helpers ---------- */
const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(v);

const statusStyle = (s: string) => {
  switch (s) {
    case 'ativo':
      return { color: 'bg-green-600', label: 'Pedido ativo' };
    case 'finalizado':
      return { color: 'bg-yellow-500', label: 'Pedido finalizado' };
    case 'cancelado':
      return { color: 'bg-red-600', label: 'Pedido cancelado' };
    default:
      return { color: 'bg-gray-500', label: s };
  }
};

/* ---------- component ---------- */
export default function OrderDashboard() {
  const [clients, setClients] = useState<User[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<(Order & { orderItem: OrderItem[] })[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [providerId, setProviderId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [expandedTables, setExpandedTables] = useState<string[]>([]);

  const toggleExpand = (id: string) =>
    setExpandedTables((p) =>
      p.includes(id) ? p.filter((t) => t !== id) : [...p, id]
    );

  /* ---------- fetch auth ---------- */
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const res = await fetch('/api/token', { credentials: 'include' });
        if (!res.ok) throw new Error();
        const { token: tk, id } = await res.json();
        setToken(tk || null);
        setProviderId(id || null);
      } catch {
        setError('Erro ao obter credenciais');
      }
    };
    loadAuth();
  }, []);

  /* ---------- fetch data ---------- */
  useEffect(() => {
    if (!providerId || !token) return;
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [uRes, tRes, oRes] = await Promise.all([
          fetch(`/api/user`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          }),
          fetch(`/api/table`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          }),
          fetch(`/api/order?providerId=${providerId}`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          }),
        ]);

        if (!uRes.ok || !tRes.ok || !oRes.ok) throw new Error();

        const [uData, tData, oData] = await Promise.all([
          uRes.json(),
          tRes.json(),
          oRes.json(),
        ]);

        setClients(uData);
        setTables(tData);
        setOrders(oData);
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

  /* ---------- group orders by table ---------- */
  const ordersByTable = tables.map((t) => ({
    ...t,
    orders: orders.filter((o) => o.tableId === t.id),
  }));

  return (
    <div className="space-y-6 p-6">
      {ordersByTable.map((tbl) => (
        <Card
          key={tbl.id}
          className="cursor-pointer transition hover:shadow-lg"
          onClick={() => toggleExpand(tbl.id)}
        >
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-medium">
              Mesa {tbl.number}{' '}
              <span className="text-sm text-gray-500 ml-1">
                ({tbl.orders.length} pedidos)
              </span>
            </h2>
            {expandedTables.includes(tbl.id) ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>

          {expandedTables.includes(tbl.id) && (
            <CardContent className="space-y-4">
              {tbl.orders.length ? (
                tbl.orders.map((order) => {
                  const { color, label } = statusStyle(order.status);
                  return (
                    <div
                      key={order.id}
                      className="border p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                            <ShoppingCart className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-base font-normal text-gray-800">
                              {order.user.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              Mesa {tbl.number}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {new Date(order.date).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div
                          className={`flex items-center gap-1 px-2 py-[2px] rounded-full text-white text-sm ${color}`}
                        >
                          {label}
                        </div>
                        <div className="text-lg font-medium text-gray-900">
                          {formatBRL(order.price)}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400">Nenhum pedido nesta mesa.</p>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
