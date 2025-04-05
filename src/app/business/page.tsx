'use client';
import { useState, useEffect } from 'react';
import CreateItem from '@/components/createItem';
import CreateTable from '@/components/createTable';
import { Users, Table as TableIcon, ShoppingCart, Trash2 } from 'lucide-react'; // ícones

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
        price: number;
        status: string;
        providerId: string;
        date: string;
    }

    const [clients, setClients] = useState<User[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [providerId, setProviderId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

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
        console.log("Nova mesa criada:", newTable); 
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
        <div className="min-h-screen bg-white p-6 text-black">
            {!token && !loading ? (
                <h1 className="text-center mt-10 text-red-500">
                    Você precisa estar logado para ver o painel do restaurante
                </h1>
            ) : (
                <>
                    <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Painel do Restaurante</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Clientes */}
                        <section className="bg-white border border-gray-200 rounded-2xl p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Users className="text-blue-600" /> Clientes
                            </h2>
                            <ul className="space-y-2">
                                {clients.length > 0 ? (
                                    clients.map((client) => (
                                        <li key={client.id} className="p-2 border border-gray-200 px-4 rounded-2xl bg-gray-50 transition">
                                            {client.name}
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">Nenhum cliente encontrado.</p>
                                )}
                            </ul>
                        </section>

                        {/* Mesas */}
                        <section className="bg-white border border-gray-200 rounded-2xl p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <TableIcon className="text-green-600" /> Mesas
                            </h2>
                            <ul className="space-y-2">
                                {tables.length > 0 ? (
                                    tables.map((table) => (
                                        <li key={table.id} className="p-2 flex flex-row justify-between border border-gray-200 px-5 rounded-2xl bg-gray-50 transition">
                                            <h1>Mesa {table.number}</h1>
                                            <button onClick={() => handleDeleteTable(table.id)}><Trash2 size={18} className="mt-1 text-red-500 cursor-pointer" /></button>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">Nenhuma mesa encontrada.</p>
                                )}
                            </ul>
                        </section>

                        {/* Pedidos */}
                        <section className="bg-white border border-gray-200 rounded-2xl p-6 md:col-span-2">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <ShoppingCart className="text-purple-600" /> Pedidos
                            </h2>
                            <ul className="space-y-2">
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <li key={order.id} className="border p-2 rounded-lg hover:bg-gray-50 transition">
                                            <span className="font-medium">Pedido #{order.id}</span> — {order.status} — <span className="text-green-600">R$ {order.price}</span>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">Nenhum pedido encontrado.</p>
                                )}
                            </ul>
                        </section>
                    </div>

                    {/* Criar Mesa e Criar Item */}
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CreateTable onTableCreated={handleTableCreated} />
                    <CreateItem />
                    </div>
                </>
            )}
        </div>
    );
};

export default BusinessPage;
