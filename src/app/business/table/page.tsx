"use client";

import {
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  User,
  Loader2,
  Plus,
  Trash2,
  Paintbrush,
  X,
  Check,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";

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

const DashboardTable = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [filteredTables, setFilteredTables] = useState<Table[]>([]);
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [providerId, setProviderId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [createError, setCreateError] = useState("");
  const [deletePopupId, setDeletePopupId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleUsers = (id: string) => {
    setExpandedUsers((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const fetchAuthData = async () => {
    try {
      setError("");
      const response = await fetch("/api/token", { credentials: "include" });
      if (!response.ok) throw new Error("Falha ao obter credenciais");
      const data = await response.json();
      setToken(data.token || null);
      setProviderId(data.id || null);
    } catch (err) {
      setError("Erro ao buscar credenciais.");
    }
  };

  const fetchTables = async () => {
    if (!providerId || !token) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/table`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao carregar mesas.");
      const data = await res.json();
      setTables(data.sort((a: Table, b: Table) => a.number - b.number));
    } catch (err) {
      setError("Erro ao buscar mesas. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  };

  const filterTables = (query: string) => {
    if (!query) {
      setFilteredTables(tables);
    } else {
      setFilteredTables(
        tables.filter((table) =>
          table.number.toString().includes(query)
        )
      );
    }
  };

  const handleCreateTable = async () => {
    if (!tableNumber) {
      setCreateError("Número da mesa obrigatório.");
      return;
    }
    if (!token || !providerId) {
      setCreateError("Credenciais inválidas.");
      return;
    }
    setCreating(true);
    setCreateError("");
    try {
      const res = await fetch("/api/table", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          number: parseInt(tableNumber, 10),
          providerId,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao criar mesa.");
      }
      const newTable = await res.json();
      setTables((prev) => [...prev, newTable.table]);
      setTableNumber("");
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "Erro inesperado");
    } finally {
      setCreating(false);
    }
  };

  const handleCleanTable = async (tableId: string) => {
    if (!token || !providerId) {
      setCreateError("Credenciais inválidas.");
      return;
    }

    setCreating(true);
    setCreateError("");
    try {
      const res = await fetch(`/api/adm`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tableId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao limpar mesa.");
      }

      setTables((prevTables) =>
        prevTables.map((table) =>
          table.id === tableId ? { ...table, user: [], order: [] } : table
        )
      );
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "Erro inesperado");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    if (!token) return;

    try {
      const res = await fetch(`/api/table?id=${tableId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      setTables((prev) => prev.filter((table) => table.id !== tableId));
      setDeletePopupId(null);
    } catch (err) {
      alert("Erro ao apagar mesa.");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedTable((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    fetchAuthData();
  }, []);

  useEffect(() => {
    fetchTables();
  }, [providerId, token]);

  useEffect(() => {
    filterTables(searchQuery);
  }, [searchQuery, tables]);

  if (loading) return <div className="text-center mt-10 text-black">Carregando...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return !token || !providerId ? (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-bold text-red-600">
        Você precisa estar logado.
      </p>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-start">
      <div className="w-full space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between px-4 items-start sm:items-center gap-3 mb-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-1 px-2 ">
            <LayoutGrid className="text-blue-600 w-4 h-4" />
            <h1 className="text-md text-blue-600 font-semibold">Mesas</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <input
                type="number"
                className="rounded-2xl border px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full pl-10"
                placeholder="Pesquisar número da mesa"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>

            <input
              type="number"
              className="rounded-2xl border px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              placeholder="Número da mesa"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-blue-700"
              onClick={handleCreateTable}
              disabled={creating}
            >
              {creating ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4" />}
              Nova Mesa
            </button>
          </div>
        </div>

        {createError && <p className="text-red-500 px-4 text-sm">{createError}</p>}

        {/* Lista de mesas em flex-col */}
        <div className="flex flex-col gap-4">
          {filteredTables.length > 0 ? (
            filteredTables.map((table) => {
              const hasOrders = table.order && table.order.length > 0;
              const latestOrder = hasOrders && table.order[table.order.length - 1];
              return (
                <div key={table.id} className="relative">
                  <div
                    className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col justify-between ${hasOrders ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
                  >
                    <div
                      onClick={() => toggleUsers(table.id)}
                      className="flex flex-row justify-between items-start gap-3"
                    >
                      <div>
                        <h2 className="font-semibold text-gray-800">Mesa {table.number}</h2>
                        <p className="text-sm text-gray-500">{table.user?.length || 0} cliente(s)</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => setDeletePopupId(table.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleCleanTable(table.id)}
                        >
                          <Paintbrush className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {hasOrders && expandedTable === table.id && (
                      <div className="mt-4 text-sm text-gray-700 space-y-2 border-t pt-2">
                        {latestOrder && (
                          <>
                            <p><strong>ID do pedido:</strong> {latestOrder.id}</p>
                            <p><strong>Data:</strong> {new Date(latestOrder.date).toLocaleString()}</p>
                            <p><strong>Total:</strong> R$ {latestOrder.price}</p>
                            <p><strong>Status:</strong> {latestOrder.status}</p>
                          </>
                        )}
                        <p><strong>Clientes:</strong> {table.user.map((u) => u.name).join(", ")}</p>
                      </div>
                    )}

                    {expandedUsers.includes(table.id) && (
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
                    )}
                  </div>

                  {deletePopupId === table.id && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white rounded-2xl">
                      <div className="bg-white p-6 rounded-xl shadow-xl border w-full max-w-xs text-center">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Deseja mesmo excluir a mesa {table.number}?</h2>
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => setDeletePopupId(null)}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-gray-300"
                          >
                            <X className="w-4 h-4" /> Cancelar
                          </button>
                          <button
                            onClick={() => handleDeleteTable(table.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-red-700"
                          >
                            <Check className="w-4 h-4" /> Confirmar
                          </button>
                        </div>
                      </div>
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
