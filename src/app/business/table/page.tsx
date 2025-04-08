'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, LayoutGrid, User } from 'lucide-react';

const DashboardTable = () => {
  interface Table {
    id: string;
    providerId: string;
    number: number;
    user: User[];
    order: Order[];
    createdAt?: string;
  }

  interface User {
    id: string;
    tableId: string;
    name: string;
    providerId: string;
    order: Order[];
    createdAt?: string;
  }

  interface Order {
    id: string;
    tableId: string;
    userId: string;
    price: number;
    status: string;
    providerId: string;
    date: string;
    createdAt?: string;
  }

  const [tables, setTables] = useState<Table[]>([]);
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [providerId, setProviderId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const isExpanded = (id: string) => expandedTable === id;

  const toggleExpand = (id: string) => {
    setExpandedTable((prev) => (prev === id ? null : id));
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

        const res = await fetch(`/api/table`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Erro ao carregar mesas.');
        }

        const data = await res.json();
        setTables(data);
      } catch (err) {
        setError('Erro ao buscar mesas. Verifique a conexão.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [providerId, token]);

  if (loading) return <div className="text-center mt-10 text-black">Carregando...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-start">
      <div className="bg-gray-50 p-3 rounded-2xl border border-gray-300 w-full max-w-7xl space-y-6">
        <div className="flex px-4 flex-row gap-2 py-2">
          <LayoutGrid className="text-blue-600 mt-1.5" />
          <h1 className="text-3xl font-bold text-gray-800">Mesas</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.length > 0 ? (
            tables.map((table) => {
              const hasOrders = table.order && table.order.length > 0;
              const latestOrder = hasOrders && table.order[table.order.length - 1];

              return (
                <div
                  key={table.id}
                  className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col ${
                    hasOrders ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
                  }`}
                  onClick={() => toggleExpand(table.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-semibold text-gray-800">Mesa {table.number}</h2>
                      <p className="text-sm text-gray-500">{table.user.length} cliente(s)</p>
                    </div>
                    {hasOrders &&
                      (isExpanded(table.id) ? (
                        <ChevronUp className="text-gray-600" />
                      ) : (
                        <ChevronDown className="text-gray-600" />
                      ))}
                  </div>

                  {hasOrders && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        Status do Último Pedido:{' '}
                        <span className="font-medium text-black">{latestOrder && typeof latestOrder !== 'boolean' ? latestOrder.status : ''}</span>
                      </p>
                      <p className="text-green-600 font-semibold">R$ {latestOrder && typeof latestOrder !== 'boolean' ? latestOrder.price : ''}</p>
                    </div>
                  )}

                  {hasOrders && isExpanded(table.id) && (
                    <div className="mt-4 text-sm text-gray-700 space-y-2 border-t pt-2">
                      <p>
                        <strong>ID do pedido:</strong> {latestOrder?.id}
                      </p>
                      <p>
                        <strong>Data:</strong>{' '}
                        {latestOrder?.date &&
                          new Date(latestOrder.date).toLocaleString()}
                      </p>
                      <p>
                        <strong>Total:</strong> R$ {latestOrder?.price}
                      </p>
                      <p>
                        <strong>Status:</strong> {latestOrder?.status}
                      </p>
                      <p>
                        <strong>Clientes:</strong> {table.user.map((u) => u.name).join(', ')}
                      </p>

                      <ul className="mt-2 space-y-1 flex flex-col list-inside text-sm text-gray-800">
                        {table.user.map((user) => (
                          <li
                            key={user.id}
                            className="flex items-center gap-3 px-4 py-2 border border-gray-300 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                              <User className="w-5 h-5" />
                            </div>
                            <h1 className="text-sm font-medium text-gray-800">{user.name}</h1>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">Nenhuma mesa encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTable;
