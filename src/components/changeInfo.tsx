import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, ImagePlus, CheckCircle, AlertCircle } from "lucide-react";

const ChangeInfo = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
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
            } catch {
                setError('Erro ao buscar credenciais.');
            }
        };
        fetchAuthData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setError('Token ausente. Você precisa estar logado.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await fetch('/api/provider', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, description, imgUrl, id: providerId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao atualizar informações.');
            }

            setSuccess('Informações atualizadas com sucesso!');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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

            setImgUrl(urlData.publicUrl);
            setMessage('Imagem enviada com sucesso!');
        } catch (err) {
            console.error(err);
            setMessage('Erro ao fazer upload da imagem');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Atualizar Informações</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        placeholder="Nome do restaurante"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        placeholder="Descrição do restaurante"
                        rows={4}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Imagem</label>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center justify-center text-sm text-gray-700 gap-2 cursor-pointer w-full px-4 py-2 border border-dashed border-gray-400 rounded-xl hover:border-blue-400 hover:bg-gray-50 transition">
                            <ImagePlus size={18} />
                            Escolher imagem
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                                className="hidden"
                            />
                        </label>

                        {uploading && (
                            <span className="text-blue-600 flex items-center gap-1">
                                <Loader2 className="animate-spin" size={18} />
                                Enviando...
                            </span>
                        )}
                    </div>

                    {imgUrl && (
                        <div className="mt-4">
                            <img
                                src={imgUrl}
                                alt="Preview"
                                className="rounded-xl border border-gray-300 w-full max-w-xs object-cover shadow-md"
                            />
                        </div>
                    )}

                    {message && (
                        <p className={`mt-2 text-sm ${message.includes('Erro') ? 'text-red-500' : 'text-green-600'}`}>
                            {message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition flex justify-center items-center gap-2"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            Salvando...
                        </>
                    ) : (
                        "Salvar alterações"
                    )}
                </button>

                {error && (
                    <p className="text-red-500 mt-2 flex items-center gap-2 text-sm">
                        <AlertCircle size={18} /> {error}
                    </p>
                )}
                {success && (
                    <p className="text-green-600 mt-2 flex items-center gap-2 text-sm">
                        <CheckCircle size={18} /> {success}
                    </p>
                )}
            </form>
        </div>
    );
};

export default ChangeInfo;
