'use client';
import { useState, useEffect } from 'react';
import CreateItem from '@/components/createItem';
import CreateTable from '@/components/createTable';
import { Users, Table as TableIcon, ShoppingCart, Trash2, BadgeCheck, Clock, DollarSign } from 'lucide-react';
import ChangeInfo from '@/components/changeInfo';

const BusinessPage = () => {
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

    const [clients, setClients] = useState<(User & { order: Order, table: Table })[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [orders, setOrders] = useState<(Order & {orderItem: OrderItem}) []>([]);
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
                    fetch(`/api/order?providerId=${providerId}`, { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' }),
                ]);

                if (!usersRes.ok || !tablesRes.ok || !ordersRes.ok) {
                    throw new Error('Erro ao carregar dados das APIs.');
                }

                const [usersData, tablesData, ordersData] = await Promise.all([
                    usersRes.json(),
                    tablesRes.json(),
                    ordersRes.json(),
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

    const handleTableCreated = (newTable: Table) => {
        setTables((prev) => [...prev, newTable]);
    };

    const handleDeleteTable = async (tableId: string) => {
        try {
            const response = await fetch(`/api/table/?id=${tableId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao deletar mesa.');
            }
            setTables((prev) => prev.filter((table) => table.id !== tableId));
        } catch (error) {
            setError('Erro ao deletar mesa. Tente novamente.');
        }
    };

    if (loading) return <div className="text-center mt-10 text-black">Carregando...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6 text-black">
            {!token && !loading ? (
                <h1 className="text-center mt-10 text-red-500">
                    Você precisa estar logado para ver o painel do restaurante
                </h1>
            ) : (
                <>
                    <div className="flex bg-gray-100 flex-col md:flex-row md:items-start gap-6 w-full">
                        <section className="bg-white border border-gray-300 rounded-2xl p-6 w-full md:w-1/3">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Users className="text-blue-600" /> Clientes
                            </h2>
                            <ul className="space-y-3">
                                {clients.length > 0 ? (
                                    clients.map((client) => (
                                        <li key={client.id} className="p-3 border border-gray-200 rounded-2xl bg-gray-50 shadow-sm">
                                            <div className="flex justify-between">
                                                <span className="font-semibold">{client.name}</span>
                                                <span className="text-sm text-gray-500">Mesa {client.table.number}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600 mt-1">
                                                <p>Status do Pedido: <span className="font-medium">{client.order.status}</span></p>
                                                <p>R$ {client.order.price}</p>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">Nenhum cliente encontrado.</p>
                                )}
                            </ul>
                        </section>

                        <section className="bg-white border border-gray-300 rounded-2xl p-6 w-full md:w-1/3">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <TableIcon className="text-green-600" /> Mesas
                            </h2>
                            <ul className="space-y-4">
                                {tables.length > 0 ? (
                                    tables.map((table) => {
                                        const isExpanded = expandedTables.includes(table.id);
                                        return (
                                            <li key={table.id} className="p-3 border border-gray-200 rounded-2xl bg-gray-50 shadow-sm">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p><strong>Mesa:</strong> {table.number}</p>
                                                        <p><strong>Clientes:</strong> {table.user.length}</p>
                                                        <p><strong>Pedidos:</strong> {table.order.length}</p>
                                                    </div>
                                                    <div className="flex gap-2 items-center">
                                                        <button
                                                            onClick={() => toggleExpandTable(table.id)}
                                                            className="text-sm text-blue-600 underline hover:text-blue-800"
                                                        >
                                                            {isExpanded ? 'Esconder clientes' : 'Ver clientes'}
                                                        </button>
                                                        <button onClick={() => handleDeleteTable(table.id)}>
                                                            <Trash2 size={20} className="text-red-500 hover:text-red-700 transition" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {isExpanded && table.user.length > 0 && (
                                                    <ul className="mt-4 space-y-2 bg-white p-2 rounded-xl border border-gray-300">
                                                        {table.user.map((user) => (
                                                            <li key={user.id} className="text-sm text-gray-700">
                                                                <strong>Nome:</strong> {user.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-gray-500">Nenhuma mesa encontrada.</p>
                                )}
                            </ul>
                        </section>

                        <section className="bg-white border border-gray-300 rounded-2xl p-6 w-full md:w-1/3">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <ShoppingCart className="text-purple-600" /> Pedidos
                            </h2>
                            <ul className="space-y-3">
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <li key={order.id} className="border p-3 rounded-xl bg-gray-50 shadow-sm">
                                            <div className="flex justify-between">
                                                <span className="font-medium">Pedido #{order.id}</span>
                                                <span className="text-sm text-gray-600">Mesa: {order.tableId}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600 mt-1">
                                                <p>Status: {order.status}</p>
                                                <p><DollarSign size={14} className="inline" /> R$ {order.price}</p>
                                                <p><Clock size={14} className="inline" /> {new Date(order.date).toLocaleString()}</p>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">Nenhum pedido encontrado.</p>
                                )}
                            </ul>
                        </section>
                    </div>
                </>
            )}
        </div>
    );
};

export default BusinessPage;