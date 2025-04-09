"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Users, User as UserIcon, ReceiptText } from "lucide-react";

const DashboardUser = () => {
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
    table?: Table;
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

  const [clients, setClients] = useState<User[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [providerId, setProviderId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/token", { credentials: "include" });
        if (!response.ok) throw new Error("Falha ao obter credenciais");
        const data = await response.json();
        setToken(data.token || null);
        setProviderId(data.id || null);
      } catch {
        setError("Erro ao buscar credenciais.");
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
        const usersRes = await fetch(`/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        if (!usersRes.ok) throw new Error("Erro ao carregar dados das APIs.");
        const usersData = await usersRes.json();
        setClients(usersData);
      } catch {
        setError("Erro ao buscar dados. Verifique a conexão.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [providerId, token]);

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  if (loading) return <div className="text-center mt-10 text-black">Carregando...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-start">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 w-full max-w-7xl shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Users className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
          <span className="ml-auto text-sm text-gray-600">Total: {clients.length}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.length > 0 ? (
            clients.map((client) => (
              <div
                key={client.id}
                className="bg-gray-100 rounded-2xl border border-gray-300 p-4 flex flex-col shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <UserIcon className="text-blue-500 w-5 h-5" />
                  <div>
                    <h2 className="font-semibold text-gray-800 text-lg">{client.name}</h2>
                    <p className="text-sm text-gray-500">Mesa {client.table?.number ?? "N/A"}</p>
                  </div>
                </div>

                {client.order.length > 0 ? (
                  client.order.map((order) => (
                    <div
                      key={order.id}
                      className="mt-3 bg-white rounded-xl p-3 border border-gray-200 shadow-sm"
                    >
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleOrder(order.id)}
                      >
                        <div className="flex items-center gap-2">
                          <ReceiptText className="text-green-500 w-4 h-4" />
                          <p className="text-sm text-gray-700 font-medium">
                            Pedido em {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        {expandedOrders[order.id] ? (
                          <ChevronUp className="text-gray-600" />
                        ) : (
                          <ChevronDown className="text-gray-600" />
                        )}
                      </div>

                      {expandedOrders[order.id] && (
                        <div className="mt-2 text-sm text-gray-600 space-y-1 border-t border-gray-200 pt-2">
                          <p><strong>ID:</strong> {order.id}</p>
                          <p><strong>Status:</strong> {order.status}</p>
                          <p><strong>Preço:</strong> R$ {order.price.toFixed(2)}</p>
                          <p><strong>Data:</strong> {new Date(order.date).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 mt-2">Nenhum pedido ainda.</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Nenhum cliente encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;
