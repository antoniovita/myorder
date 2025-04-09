"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Users } from "lucide-react";

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

  interface OrderItem {
    id: string;
    itemId: string;
    quantity: string;
    orderId: string;
    observation: string;
  }

  const [clients, setClients] = useState<(User & { order: Order; table: Table })[]>([]);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [providerId, setProviderId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("/api/token", { credentials: "include" });
        if (!response.ok) throw new Error("Falha ao obter credenciais");
        const data = await response.json();
        setToken(data.token || null);
        setProviderId(data.id || null);
      } catch (err) {
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
        setError("");

        const usersRes = await fetch(`/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        if (!usersRes.ok) {
          throw new Error("Erro ao carregar dados das APIs.");
        }

        const usersData = await usersRes.json();
        setClients(usersData);
      } catch (err) {
        setError("Erro ao buscar dados. Verifique a conexão.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [providerId, token]);

  const toggleExpand = (id: string) => {
    setExpandedClient((prev) => (prev === id ? null : id));
  };

  if (loading) return <div className="text-center mt-10 text-black">Carregando...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-start">
      <div className=" bg-white  p-3 rounded-2xl border border-gray-300 w-full max-w-7xl space-y-6">
        <div className="flex px-4 flex-row gap-2 py-2">
          <Users className="text-blue-600 mt-1.5" /> 
          <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.length > 0 ? (
            clients.map((client) => {
              const hasOrder = !client.order;

              return (
                <div
                  key={client.id}
                  className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col ${
                    hasOrder ? "cursor-pointer hover:shadow-md transition-shadow" : ""
                  }`}
                  onClick={() => hasOrder && toggleExpand(client.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-semibold text-gray-800">{client.name}</h2>
                      <p className="text-sm text-gray-500">Mesa {client.table.number}</p>
                    </div>
                    {hasOrder && (
                      expandedClient === client.id
                        ? <ChevronUp className="text-gray-600" />
                        : <ChevronDown className="text-gray-600" />
                    )}
                  </div>

                  {hasOrder && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        Status do Pedido:{" "}
                        <span className="font-medium text-black">{client.order.status}</span>
                      </p>
                      <p className="text-green-600 font-semibold">R$ {client.order.price}</p>
                    </div>
                  )}

                  {hasOrder && expandedClient === client.id && (
                    <div className="mt-4 text-sm text-gray-700 space-y-2 border-t pt-2">
                      <p><strong>ID do pedido:</strong> {client.order.id}</p>
                      <p><strong>Data:</strong> {new Date(client.order.date).toLocaleString()}</p>
                      <p><strong>Responsável:</strong> {client.name}</p>
                      <p><strong>Status:</strong> {client.order.status}</p>
                      <p><strong>Total:</strong> R$ {client.order.price}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">Nenhum cliente encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;
