'use client';
import { useState, useEffect } from 'react';

const CreateTable = () => {
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
                console.log('🔍 Buscando credenciais...');
                const response = await fetch('/api/token', { credentials: 'include' });
                if (!response.ok) throw new Error('Falha ao obter credenciais');
                
                const data = await response.json();
                console.log('✅ Dados de autenticação recebidos:', data);
                
                setToken(data.token || null);
                setProviderId(data.id || null);
            } catch (err) {
                console.error('❌ Erro ao buscar dados de autenticação:', err);
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
            console.log('❌ Credenciais ausentes:', { token, providerId });
            return;
        }
        
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            console.log(`Criando mesa número ${tableNumber}...`);
            console.log('Enviando requisição com:', { token, providerId, tableNumber });
            
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
            
            setSuccess('Mesa criada com sucesso!');
            setTableNumber('');
            console.log('✅ Mesa criada com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao criar mesa:', error);
            setError(error instanceof Error ? error.message : 'Erro inesperado.');
        } finally {
            setLoading(false);
            window.location.reload();
        }
    };

    return (
        <div className="bg-white shadow-md rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-4">Criar Nova Mesa</h2>
            <input 
                type="number" 
                value={tableNumber} 
                onChange={(e) => setTableNumber(e.target.value)} 
                placeholder="Número da mesa"
                className="border p-2 rounded-lg w-full mb-2"
            />
            <button 
                onClick={handleCreateTable} 
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
            >
                {loading ? 'Criando...' : 'Criar Mesa'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
        </div>
    );
};

export default CreateTable;
