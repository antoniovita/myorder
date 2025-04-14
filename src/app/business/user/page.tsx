"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Users, User, ReceiptText, Search } from "lucide-react";

const DashboardUser = () => {
  interface Table {
    id: string;
    providerId: string;
    number: number;
    user: UserType[];
    order: Order[];
    createdAt?: string;
  }

  interface UserType {
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

  const [clients, setClients] = useState<UserType[]>([]);
  const [filteredClients, setFilteredClients] = useState<UserType[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [providerId, setProviderId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tableFilter, setTableFilter] = useState<string>("");

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
        setFilteredClients(usersData);
      } catch {
        setError("Erro ao buscar dados. Verifique a conexão.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [providerId, token]);

  useEffect(() => {
    let filtered = clients;

    if (tableFilter) {
      filtered = filtered.filter((client) => client.table?.number === parseInt(tableFilter));
    }

    if (searchQuery) {
      filtered = filtered.filter((client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredClients(filtered);
  }, [searchQuery, tableFilter, clients]);

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const toggleUser = (userId: string) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  if (loading) return <div className="text-center mt-10 text-black">Carregando...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    !token || !providerId ? (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-bold text-red-600">
          Você precisa estar logado.
        </p>
      </div>
    ) : (
      <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-start">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 w-full">
          <div className="flex items-center gap-2 mb-6">
            <Users className="text-blue-600" />
            <h1 className="text-3xl font-semibold text-blue-600">Clientes</h1>
            <span className="ml-auto text-sm text-gray-500">Total: {filteredClients.length}</span>
          </div>

          <div className="flex gap-4 mb-6 flex-wrap">
            <div className="border border-gray-300 rounded-2xl p-2 flex items-center w-full md:w-1/2 lg:w-1/3">
              <Search className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Buscar por nome"
                className="w-full focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center w-full md:w-1/2 lg:w-1/3">
              <input
                type="number"
                placeholder="Filtrar por mesa"
                className="w-full p-2 border border-gray-300 rounded-2xl focus:outline-none"
                value={tableFilter}
                onChange={(e) => setTableFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md transition-shadow hover:shadow-lg"
                >
                  <div
                    className="flex items-center gap-3 mb-4 cursor-pointer"
                    onClick={() => toggleUser(client.id)}
                  >
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-800 text-xl">{client.name}</h2>
                      <p className="text-sm text-gray-500">Mesa {client.table?.number ?? "N/A"}</p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 ml-auto ${expandedUsers[client.id] ? "rotate-180" : ""}`}
                    />
                  </div>

                  {/* Pedidos do usuário */}
                  {expandedUsers[client.id] && client.order.length > 0 ? (
                    client.order.map((order) => (
                      <div
                        key={order.id}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-4"
                      >
                        <div
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleOrder(order.id)}
                        >
                          <div className="flex items-center gap-3">
                            <ReceiptText className="text-green-500 w-5 h-5" />
                            <p className="text-sm text-gray-700 font-medium">
                              Pedido em {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          {expandedOrders[order.id] ? (
                            <ChevronUp className="text-gray-600 w-5 h-5" />
                          ) : (
                            <ChevronDown className="text-gray-600 w-5 h-5" />
                          )}
                        </div>

                        {expandedOrders[order.id] && (
                          <div className="mt-4 text-sm text-gray-600 space-y-2 border-t border-gray-200 pt-4">
                            <p><strong>ID:</strong> {order.id}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Preço:</strong> R$ {order.price.toFixed(2)}</p>
                            <p><strong>Data:</strong> {new Date(order.date).toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    expandedUsers[client.id] && (
                      <p className="text-sm text-gray-400 mt-2">Nenhum pedido ainda.</p>
                    )
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Nenhum cliente encontrado.</p>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DashboardUser;
