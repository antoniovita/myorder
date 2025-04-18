'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Table as TableIcon,
  ShoppingCart,
  Clock,
  DollarSign,
  User,
  CircleCheck,
  CircleUserRound
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const BusinessPage = () => {
  interface Table {
    id: string;
    providerId: string;
    number: number;
    user: User[];
    order: Order[];
  }

  interface User {
    id: string;
    tableId: string;
    name: string;
    providerId: string;
    order: Order[];
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
    quantity: string;
    orderId: string;
    observation: string;
  }

  const [clients, setClients] = useState<(User & { order: Order; table: Table })[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<(Order & { orderItem: OrderItem })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [providerId, setProviderId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [expandedTables, setExpandedTables] = useState<string[]>([]);

  const toggleExpandTable = (tableId: string) => {
    setExpandedTables((prev) =>
      prev.includes(tableId) ? prev.filter((id) => id !== tableId) : [...prev, tableId]
    );
  };

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch('/api/token', { credentials: 'include' });
        if (!response.ok) throw new Error('Falha ao obter credenciais');
        const data = await response.json();
        setToken(data.token || null);
        setProviderId(data.id || null);
      } catch (err) {
        setError('Erro ao buscar credenciais.');
      } finally {
        setLoading(false);
      }
    };
    fetchAuthData();
  }, []);

  useEffect(() => {
    if (!providerId || !token) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [usersRes, tablesRes, ordersRes] = await Promise.all([
          fetch(`/api/user`, { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' }),
          fetch(`/api/table`, { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' }),
          fetch(`/api/order?providerId=${providerId}`, { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' })
        ]);

        if (!usersRes.ok || !tablesRes.ok || !ordersRes.ok) {
          throw new Error('Erro ao carregar dados das APIs.');
        }

        const [usersData, tablesData, ordersData] = await Promise.all([
          usersRes.json(),
          tablesRes.json(),
          ordersRes.json()
        ]);

        setClients(usersData);
        setTables(tablesData);
        setOrders(ordersData);
      } catch (err) {
        setError('Erro ao buscar dados. Verifique a conexão.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [providerId, token]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-60 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  const formatBRL = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(v);

  return (
    <div className="flex-col flex gap-6 px-4">
      <Card>
        
        <CardContent className="space-y-2">
          {clients.length ? (
            clients.map((client) => (
              <div key={client.id} className="border p-3 rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-700">{client.name}</span>
                </div>
                <span className="text-sm text-gray-500">Mesa {client.table.number}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Nenhum cliente encontrado.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        
        <CardContent className="space-y-3">
          {tables.length ? (
            tables.map((table) => {
              const isExpanded = expandedTables.includes(table.id);
              return (
                <div key={table.id} className="border p-3 rounded-xl">
                  <div
                    onClick={() => toggleExpandTable(table.id)}
                    className="flex justify-between items-center cursor-pointer"
                  >
                    <p className="font-semibold">Mesa {table.number}</p>
                    <span className="text-sm text-gray-500">
                      {table.user.length} cliente(s)
                    </span>
                  </div>
                  {isExpanded && (
                    <ul className="mt-3 space-y-2">
                      {table.user.map((u) => (
                        <li key={u.id} className="flex items-center gap-1 text-sm text-gray-600">
                          <CircleUserRound className="w-3.5 h-3.5 text-gray-500" /> <h1 className='text-gray-500'>{u.name}</h1>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-400">Nenhuma mesa encontrada.</p>
          )}
        </CardContent>
      </Card>

      <Card>
  
  <CardContent className="space-y-4">
    {orders.length ? (
      orders.map((order) => {
        const getStatusStyle = (status: string) => {
          switch (status) {
            case 'ativo':
              return {
                color: 'bg-green-600',
                label: 'Pedido ativo',
              };
            case 'finalizado':
              return {
                color: 'bg-yellow-500',
                label: 'Pedido finalizado',
              };
            case 'cancelado':
              return {
                color: 'bg-red-600',
                label: 'Pedido cancelado',
              };
            default:
              return {
                color: 'bg-gray-500',
                label: status,
              };
          }
        };

        const { color,  label } = getStatusStyle(order.status);

        return (
          <div
            key={order.id}
            className="border p-4 rounded-2xl bg-white hover transitionace-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-normal text-gray-800">{order.user.name}</span>
                  <span className="text-sm text-gray-500 font-normal">Mesa {order.table.number}</span>
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
              <div className={`flex items-center font-normal gap-1 px-2 py-[2px] rounded-full text-white text-sm ${color}`}>
                <h1>{label}</h1>
              </div>

              <div className="px-3 py-1 text-lg font-normal text-black">
                {formatBRL(order.price)}
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <p className="text-gray-400">Nenhum pedido encontrado.</p>
    )}
  </CardContent>
</Card>




    </div>
  );
};

export default BusinessPage;
