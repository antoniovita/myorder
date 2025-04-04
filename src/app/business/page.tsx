'use client';
import CreateTable from '@/components/createTable';
import { useState, useEffect } from 'react';

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

                console.log("🔍 Buscando token e providerId...");
                const response = await fetch('/api/token', { credentials: 'include' });

                if (!response.ok) throw new Error('Falha ao obter credenciais');

                const data = await response.json();
                console.log("✅ Credenciais carregadas:", data);

                setToken(data.token || null);
                setProviderId(data.id || null);
            } catch (err) {
                console.error("❌ Erro ao buscar credenciais:", err);
                setError('Erro ao buscar credenciais.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchAuthData();
    }, []);

    useEffect(() => {
        if (!providerId || !token) {
            console.log(" Aguardando credenciais...");
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                console.log(`Iniciando GETs com providerId: ${providerId}`);

                const [usersRes, tablesRes, ordersRes] = await Promise.all([
                    fetch(`/api/user`, {
                        headers: { Authorization: `Bearer ${token}` },
                        credentials: 'include',
                    }),
                    fetch(`/api/table`, {
                        headers: { Authorization: `Bearer ${token}` },
                        credentials: 'include',
                    }),
                    fetch(`/api/order?providerId=${providerId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                        credentials: 'include',
                    }),
                ]);

                console.log("🔍 Resposta /api/user:", usersRes.status);
                console.log("🔍 Resposta /api/table:", tablesRes.status);
                console.log("🔍 Resposta /api/order:", ordersRes.status);

                if (!usersRes.ok || !tablesRes.ok || !ordersRes.ok) {
                    throw new Error('Erro ao carregar dados das APIs.');
                }

                const [usersData, tablesData, ordersData] = await Promise.all([
                    usersRes.json(),
                    tablesRes.json(),
                    ordersRes.json(),
                ]);

                console.log("✅ Clientes carregados:", usersData);
                console.log("✅ Mesas carregadas:", tablesData);
                console.log("✅ Pedidos carregados:", ordersData);

                setClients(usersData);
                setTables(tablesData);
                setOrders(ordersData);
            } catch (err) {
                console.error("❌ Erro ao buscar dados:", err);
                setError('Erro ao buscar dados. Verifique a conexão.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [providerId, token]);

    if (loading) return <div className="text-center mt-10 bg-white text-black">Carregando...</div>;
    if (error) return <div className="text-center mt-10 bg-white text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6 text-black">
            {!token && !loading ? (
            <h1 className="text-center mt-10 text-red-500">
                Você precisa estar logado para ver o painel do restaurante
            </h1>   
        ) : (
            <>
            <h1 className="text-3xl font-bold text-center mb-6">Painel do Restaurante</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow-md rounded-xl p-4">
                    <h2 className="text-xl font-semibold mb-4">Clientes do Restaurante</h2>
                    <ul className="space-y-2">
                        {clients.length > 0 ? (
                            clients.map((client) => (
                                <li key={client.id} className="border p-2 rounded-lg">
                                    {client.name}
                                </li>
                            ))
                        ) : (
                            <p>Nenhum cliente encontrado.</p>
                        )}
                    </ul>
                </div>
                <div className="bg-white shadow-md rounded-xl p-4">
                    <h2 className="text-xl font-semibold mb-4">Mesas do Restaurante</h2>
                    <ul className="space-y-2">
                        {tables.length > 0 ? (
                            tables.map((table) => (
                                <li key={table.id} className="border p-2 rounded-lg">
                                    Mesa {table.number}
                                </li>
                            ))
                        ) : (
                            <p>Nenhuma mesa encontrada.</p>
                        )}
                    </ul>
                </div>
                <div className="bg-white shadow-md rounded-xl p-4 md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Pedidos do Restaurante</h2>
                    <ul className="space-y-2">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <li key={order.id} className="border p-2 rounded-lg">
                                    Pedido #{order.id} - {order.status} - R$ {order.price}
                                </li>
                            ))
                        ) : (
                            <p>Nenhum pedido encontrado.</p>
                        )}
                    </ul>
                </div>
            </div>
            <CreateTable></CreateTable>
            </>
        )}
        </div>
    );
};

export default BusinessPage;
