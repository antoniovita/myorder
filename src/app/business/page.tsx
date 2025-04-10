'use client';
import { useState, useEffect } from 'react';
import { Users, Table as TableIcon, ShoppingCart, Trash2, Clock, DollarSign, User } from 'lucide-react';

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

    if (loading) return <div className="text-center mt-10 text-gray-700">Carregando...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="bg-gray-50 p-6 border border-gray-200 rounded-2xl w-full space-y-6">
            {!token && !loading ? (
                <h1 className="text-center mt-10 text-red-500">
                    Você precisa estar logado para ver o painel do restaurante
                </h1>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <section className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-600">
                            <Users className="w-5 h-5" /> Clientes ({clients.length})
                        </h2>
                        <ul className="space-y-3">
                            {clients.length > 0 ? (
                                clients.map((client) => (
                                    <li key={client.id} className="border rounded-2xl p-3 bg-white transition">
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-row gap-3">
                                                <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <h1 className='mt-2 text-xl'> {client.name}</h1>
                                            </div>
                                            <span className="text-sm text-gray-500">Mesa {client.table.number}</span>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">Nenhum cliente encontrado.</p>
                            )}
                        </ul>
                    </section>

                    <section className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-600">
                            <TableIcon className="w-5 h-5" /> Mesas
                        </h2>
                        <ul className="space-y-3">
                            {tables.length > 0 ? (
                                tables.map((table) => {
                                    const isExpanded = expandedTables.includes(table.id);
                                    return (
                                        <li
                                            key={table.id}
                                            onClick={() => toggleExpandTable(table.id)}
                                            className="border rounded-xl p-4 bg-white cursor-pointer transition"
                                        >
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-gray-800">Mesa {table.number}</p>
                                                <span className="text-sm bg-gray-100 border border-gray-300 px-3 py-1 rounded-full text-gray-500">
                                                    {table.user.length} cliente(s)
                                                </span>
                                            </div>

                                            {isExpanded && table.user.length > 0 && (
                                                <ul className="mt-3 space-y-2">
                                                    {table.user.map((user) => (
                                                        <li
                                                            key={user.id}
                                                            className="flex items-center gap-2 p-2 rounded-2xl bg-white border text-gray-700"
                                                        >
                                                            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                                                                <User className="w-4 h-4" />
                                                            </div>
                                                            <span>{user.name}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-gray-400">Nenhuma mesa encontrada.</p>
                            )}
                        </ul>
                    </section>


                    <section className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-600">
                            <ShoppingCart className="w-5 h-5" /> Pedidos
                        </h2>
                        <ul className="space-y-3">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <li key={order.id} className="border rounded-xl p-4 bg-white hover:bg-gray-100 transition">
                                        <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                                            <span># {order.id}</span>
                                            <span className="text-gray-500">Mesa {order.tableId}</span>
                                        </div>
                                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                                            <span>Status: {order.status}</span>
                                            <span className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" /> R$ {order.price}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" /> {new Date(order.date).toLocaleString()}
                                            </span>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">Nenhum pedido encontrado.</p>
                            )}
                        </ul>
                    </section>
                </div>
            )}
        </div>
    );
};

export default BusinessPage;
