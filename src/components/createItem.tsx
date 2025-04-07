'use client';
import { useEffect, useState } from 'react';
import { Loader2, ImagePlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const CreateItem = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagemUrl, setImagemUrl] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [providerId, setProviderId] = useState<string | null>(null);

        useEffect(() => {
            const fetchAuthData = async () => {
                setError('');
                try {
                    const response = await fetch('/api/token', { credentials: 'include' });
                    if (!response.ok) throw new Error('Falha ao obter credenciais');
    
                    const data = await response.json();
                    setToken(data.token || null);
                    setProviderId(data.id || null);
                } catch (err) {
                    setError('Erro ao buscar credenciais.');
                }
            };
    
            fetchAuthData();
        }, []);
    

    const handleImageUpload = async (file: File) => {
        setUploading(true);
        const fileName = `${Date.now()}-${file.name}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('images')
                .getPublicUrl(fileName);

            if (!urlData?.publicUrl) throw new Error('Erro ao gerar URL da imagem');

            setImagemUrl(urlData.publicUrl);
            console.log(urlData.publicUrl)
            setMessage('');
        } catch (err) {
            console.error(err);
            setMessage('❌ Erro ao fazer upload da imagem');
        } finally {
            setUploading(false);
        }
    };

    const handleCreateItem = async (e: any) => {
        e.preventDefault();

        if (!imagemUrl) {
            setMessage('⚠️ Por favor, envie uma imagem antes de criar o item.');
            return;
        }

        try {
            const res = await fetch('/api/item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    price: parseFloat(price),
                    description,
                    imgUrl: imagemUrl,
                    providerId,
                }),
            });

            if (!res.ok) throw new Error('Erro ao criar item.');

            setMessage('✅ Item criado com sucesso!');
            setName('');
            setPrice('');
            setDescription('');
            setImageFile(null);
            setImagemUrl('');
        } catch (error: any) {
            setMessage(`❌ ${error.message}`);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-8 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Criar Novo Item</h2>

            <form onSubmit={handleCreateItem} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border bg-gray-50 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        step="0.01"
                        className="w-full px-4 py-2 border bg-gray-50 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        required
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Imagem</label>
                    <label className="flex items-center gap-2 cursor-pointer w-full px-4 py-2 border border-dashed border-gray-400 rounded-xl hover:border-orange-400 transition">
                        <ImagePlus className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-600 text-sm">Escolher imagem...</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setImageFile(file);
                                    handleImageUpload(file);
                                }
                            }}
                            className="hidden"
                            required
                        />
                    </label>
                    {uploading && (
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <Loader2 className="animate-spin w-4 h-4" /> Enviando imagem...
                        </p>
                    )}
                    {imagemUrl && (
                        <img
                            src={imagemUrl}
                            alt="Preview"
                            className="mt-3 w-full h-48 object-cover rounded-xl border"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    className={`flex justify-center items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-xl transition ${
                        uploading && 'opacity-60 cursor-not-allowed'
                    }`}
                    disabled={uploading}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="animate-spin w-5 h-5" /> Aguarde...
                        </>
                    ) : (
                        'Criar Item'
                    )}
                </button>
            </form>

            {message && (
                <p className="text-sm text-center mt-4 font-medium text-gray-700">
                    {message}
                </p>
            )}
        </div>
    );
};

export default CreateItem;
