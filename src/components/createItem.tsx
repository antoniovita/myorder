import { useState } from 'react';

const CreateItem = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleCreateItem = async (e:any) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    price: parseFloat(price),
                    description,
                }),
            });

            if (!res.ok) {
                throw new Error('Erro ao criar item.');
            }

            const data = await res.json();
            setMessage('Item criado com sucesso!');
            // Limpa o formulário
            setName('');
            setPrice('');
            setDescription('');
        } catch (error: any) {
            setMessage(error.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Criar novo item</h2>
            <form onSubmit={handleCreateItem} className="space-y-4">
                <div>
                    <label className="block font-medium">Nome</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Preço</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                        step="0.01"
                    />
                </div>

                <div>
                    <label className="block font-medium">Descrição</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Criar Item
                </button>
            </form>

            {message && (
                <div className="mt-4 text-center text-green-600 font-medium">
                    {message}
                </div>
            )}
        </div>
    );
};

export default CreateItem;
