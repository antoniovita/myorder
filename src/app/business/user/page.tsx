"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Users,
  User,
  ReceiptText,
  Search
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const toggleUser = (userId: string) => {
    setExpandedUsers((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  if (loading) return <div className="text-center mt-10 text-black">Carregando...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!token || !providerId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-bold text-red-600">Você precisa estar logado.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardHeader className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="flex items-center gap-2 text-blue-600">
            <Users className="w-5 h-5" />
            <CardTitle>Clientes ({filteredClients.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center border border-gray-300 rounded-xl px-3 w-full md:w-1/2">
            <Search className="text-gray-400 w-4 h-4 mr-2" />
            <Input
              placeholder="Buscar por nome"
              className="border-none focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Input
            type="number"
            placeholder="Filtrar por mesa"
            className="w-full md:w-1/2"
            value={tableFilter}
            onChange={(e) => setTableFilter(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="transition hover:shadow-md">
            <CardHeader
              onClick={() => toggleUser(client.id)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{client.name}</h2>
                <p className="text-sm text-gray-500">Mesa {client.table?.number ?? "N/A"}</p>
              </div>
              <ChevronDown
                className={`ml-auto transition-transform ${expandedUsers[client.id] ? "rotate-180" : "rotate-0"}`}
              />
            </CardHeader>
            {expandedUsers[client.id] && (
              <CardContent className="space-y-4">
                {client.order.length ? (
                  client.order.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                    >
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleOrder(order.id)}
                      >
                        <div className="flex items-center gap-2">
                          <ReceiptText className="text-green-500 w-4 h-4" />
                          <span className="text-sm">Pedido em {new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        {expandedOrders[order.id] ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      {expandedOrders[order.id] && (
                        <div className="mt-3 text-sm text-gray-600 space-y-1">
                          <p><strong>ID:</strong> {order.id}</p>
                          <p><strong>Status:</strong> {order.status}</p>
                          <p><strong>Preço:</strong> R$ {order.price.toFixed(2)}</p>
                          <p><strong>Data:</strong> {new Date(order.date).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">Nenhum pedido ainda.</p>
                )}
              </CardContent>
            )}
          </Card>
        ))}
        {!filteredClients.length && <p className="text-sm text-gray-500">Nenhum cliente encontrado.</p>}
      </div>
    </div>
  );
};

export default DashboardUser;
