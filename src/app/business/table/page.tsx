"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Loader2,
  Plus,
  Trash2,
  Paintbrush,
  Search,
  AlertCircle,
  Info,
  CheckCircle,
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
  const [expandedTables, setExpandedTables] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [message, setMessage] = useState("");
  const [providerId, setProviderId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [cleaningTableId, setCleaningTableId] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState("");
  const [deletePopupId, setDeletePopupId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const isExpanded = (id: string) => expandedTables.includes(id);
  const toggleExpand = (id: string) => {
    setExpandedTables((prev) =>
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
    } catch {
      setError("Erro ao buscar credenciais.");
    }
  };

  const fetchTables = async () => {
    if (!providerId || !token) return;
    try {
      const res = await fetch(`/api/table`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao carregar mesas.");
      const data = await res.json();
      const sortedTables = data.sort((a: Table, b: Table) => a.number - b.number);
      setTables(sortedTables);
      setFilteredTables(sortedTables);
    } catch {
      setError("Erro ao buscar mesas. Verifique a conexão.");
    }
  };

  const filterTables = (query: string) => {
    setFilteredTables(
      query ? tables.filter((t) => t.number.toString().includes(query)) : tables
    );
  };

  const showTemporaryMessage = (setter: (val: string) => void, value: string) => {
    setter(value);
    setTimeout(() => setter(""), 3000);
  };

  const handleCreateTable = async () => {
    if (!tableNumber) return showTemporaryMessage(setError, "Número da mesa obrigatório.");
    if (!token || !providerId) return showTemporaryMessage(setError, "Credenciais inválidas.");

    setCreating(true);
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
      if (!res.ok) throw new Error((await res.json()).message || "Erro ao criar mesa.");

      const newTable = await res.json();
      const updated = [...tables, newTable.table].sort((a, b) => a.number - b.number);
      setTables(updated);
      setFilteredTables(updated);
      setTableNumber("");
      showTemporaryMessage(setSuccess, "Mesa criada com sucesso!");
    } catch {
      showTemporaryMessage(setError, "Erro inesperado ao criar mesa.");
    } finally {
      setCreating(false);
    }
  };

  const handleCleanTable = async (tableId: string) => {
    if (!token || !providerId) return showTemporaryMessage(setError, "Credenciais inválidas.");

    setCleaningTableId(tableId);
    try {
      const res = await fetch(`/api/adm`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tableId }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Erro ao limpar mesa.");

      setTables((prev) =>
        prev.map((table) =>
          table.id === tableId ? { ...table, user: [], order: [] } : table
        )
      );
      showTemporaryMessage(setSuccess, "Mesa limpa com sucesso!");
    } catch {
      showTemporaryMessage(setError, "Erro inesperado ao limpar mesa.");
    } finally {
      setCleaningTableId(null);
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
      if (!res.ok) throw new Error("Erro ao deletar mesa.");
      const updated = tables.filter((t) => t.id !== tableId);
      setTables(updated);
      setFilteredTables(updated);
      showTemporaryMessage(setSuccess, "Mesa excluída com sucesso!");
      setDeletePopupId(null);
    } catch {
      showTemporaryMessage(setError, "Erro ao apagar mesa.");
    }
  };

  useEffect(() => {
    fetchAuthData();
  }, []);

  useEffect(() => {
    if (providerId && token) fetchTables();
  }, [providerId, token]);

  useEffect(() => {
    filterTables(searchQuery);
  }, [searchQuery, tables]);

  return (
    <>
      <Dialog open={!!error} onOpenChange={() => setError("")}> <DialogContent><DialogHeader><DialogTitle className="text-red-600 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Erro</DialogTitle><DialogDescription>{error}</DialogDescription></DialogHeader></DialogContent></Dialog>
      <Dialog open={!!message} onOpenChange={() => setMessage("")}> <DialogContent><DialogHeader><DialogTitle className="text-blue-600 flex items-center gap-2"><Info className="w-5 h-5" /> Informação</DialogTitle><DialogDescription>{message}</DialogDescription></DialogHeader></DialogContent></Dialog>
      <Dialog open={!!success} onOpenChange={() => setSuccess("")}> <DialogContent><DialogHeader><DialogTitle className="text-green-600 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Sucesso</DialogTitle><DialogDescription>{success}</DialogDescription></DialogHeader></DialogContent></Dialog>

      <div className="min-h-screen bg-gray-50 px-4 flex justify-center items-start">
      <div className="w-full space-y-3">
        <Dialog open={!!deletePopupId} onOpenChange={() => setDeletePopupId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>Deseja mesmo excluir esta mesa?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setDeletePopupId(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={() => deletePopupId && handleDeleteTable(deletePopupId)}>Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="sm:flex sm:justify-center sm:items-center">
          <div className="flex flex-col sm:flex-row items-start max-w-2xl justify-center rounded-3xl sm:items-center gap-3 mb-4 bg-white p-4 shadow-sm border border-gray-200">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {filteredTables.length > 0 ? (
            filteredTables.map((table) => (
              <div key={table.id} className="relative">
                <div
                  onClick={() => toggleExpand(table.id)}
                  className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow`}
                >
                  <div className="flex flex-row justify-between items-start gap-3">
                    <div>
                      <h2 className="font-semibold text-gray-800">Mesa {table.number}</h2>
                      <p className="text-sm text-gray-500">{table.user?.length || 0} cliente(s)</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletePopupId(table.id);
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCleanTable(table.id);
                        }}
                      >
                        {cleaningTableId === table.id ? (
                          <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                          <Paintbrush className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded(table.id) && (
                    <div className="mt-4 space-y-3 text-sm text-gray-700 border-t pt-3">
                      <div>
                        {table.user.length > 0 ? (
                          <ul className="space-y-1">
                            {table.user.map((user) => (
                              <li key={user.id} className="flex items-center gap-2">
                                <div className=" bg-blue-100 p-1 rounded-full"><User className="w-4 h-4 text-blue-500" /></div>
                                
                                {user.name}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">Nenhum cliente.</p>
                        )}
                      </div>

                      <div className="border-t pt-3">
                        <ul className="space-y-3">
                        {table.order.length > 0 ? (
                          <ul className="space-y-3">
                            {table.order.map((order) => (
                              <li
                                key={order.id}
                                className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-gray-500">
                                    {new Date(order.date).toLocaleString("pt-BR", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                  <span
                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                      order.status === "ativo"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-400 text-white"
                                    }`}
                                  >
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </div>

                                <div className="text-gray-700 text-sm">
                                  <p>
                                    <span className="font-medium">Total:</span>{" "}
                                    <span className="text-blue-600 font-semibold">
                                      R$ {order.price.toFixed(2)}
                                    </span>
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">Nenhum pedido.</p>
                        )}

                        </ul>

                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Nenhuma mesa encontrada.</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default DashboardTable;
