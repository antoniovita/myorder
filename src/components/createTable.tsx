'use client';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface CreateTableProps {
    onTableCreated: (newTable: {
        id: string;
        number: number;
        providerId: string;
        user: [];
        order: [];
    }) => void;
}

const CreateTable = ({ onTableCreated }: CreateTableProps) => {
    const [tableNumber, setTableNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [providerId, setProviderId] = useState<string | null>(null);

    useEffect(() => {
        const fetchAuthData = async () => {
            setLoading(true);
            setError('');
            try {
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

    const handleCreateTable = async () => {
        if (!tableNumber) {
            setError('O número da mesa é obrigatório.');
            return;
        }

        if (!token || !providerId) {
            setError('Credenciais não encontradas. Tente novamente.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/table', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    number: parseInt(tableNumber, 10),
                    providerId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar a mesa.');
            }

            const newTable = await response.json();
            console.log('Nova mesa criada:', newTable);
            onTableCreated(newTable.table);
            setSuccess('✅ Mesa criada com sucesso!');
            setTableNumber('');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro inesperado.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTableNumber(e.target.value);
        if (error) setError('');
        if (success) setSuccess('');
    };

    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 mt-8 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Criar Nova Mesa</h2>

            <div className="flex flex-col gap-3">
                <input
                    type="number"
                    value={tableNumber}
                    onChange={handleChange}
                    placeholder="Número da mesa"
                    className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />

                <button
                    onClick={handleCreateTable}
                    disabled={loading}
                    className={`flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition ${
                        loading && 'opacity-60 cursor-not-allowed'
                    }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin w-5 h-5" /> Criando...
                        </>
                    ) : (
                        'Criar Mesa'
                    )}
                </button>

                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && <p className="text-sm text-green-500">{success}</p>}
            </div>
        </div>
    );
};

export default CreateTable;
