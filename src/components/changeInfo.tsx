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
            } catch (err) {
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
        <div className="bg-white rounded-2xl p-10 shadow-xl max-w-2xl mx-auto mt-10">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">Atualizar informações</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Nome</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-100 focus:bg-white border-none rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        placeholder="Nome do restaurante"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Descrição</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-gray-100 focus:bg-white border-none rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        placeholder="Descrição do restaurante"
                        rows={4}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Imagem</label>
                    <div className="flex items-center gap-4">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm font-medium text-gray-700 rounded-xl transition">
                            <ImagePlus size={18} />
                            Anexar imagem
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
                                className="rounded-full border border-black w-40 h-40 object-cover shadow-lg"
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition flex justify-center items-center gap-2"
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
                    <p className="text-red-500 mt-4 flex items-center gap-2 text-sm">
                        <AlertCircle size={18} /> {error}
                    </p>
                )}
                {success && (
                    <p className="text-green-600 mt-4 flex items-center gap-2 text-sm">
                        <CheckCircle size={18} /> {success}
                    </p>
                )}
            </form>
        </div>
    );
};

export default ChangeInfo;
