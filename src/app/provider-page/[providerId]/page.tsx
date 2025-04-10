"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

const ProviderWelcomePage = () => {
    const router = useRouter();
    const { providerId } = useParams() as { providerId: string };

    const [providerData, setProviderData] = useState<{ name?: string; description?: string; imgUrl?: string }>({});
    const [name, setName] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (providerId) {
            fetch(`/api/provider/?id=${providerId}`)
                .then((res) => res.json())
                .then((data) => setProviderData(data))
                .catch((err) => console.error("Erro ao buscar dados do provedor:", err));
        }
    }, [providerId]);

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        const payload = {
            name,
            tableNumber: Number(tableNumber),
            providerId,
        };

        try {
            const res = await fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Erro ao criar usuário.");

            router.push(`/provider-page/${providerId}/items`);
        } catch (err) {
            setError("Falha ao criar usuário. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center px-4">
            <div className="bg-white border border-gray-200 shadow-xl flex flex-col gap-3 rounded-2xl max-w-md w-full p-8">

                <div className="flex justify-center mb-6">
                    {providerData.imgUrl ? (
                        <Image
                            src={providerData.imgUrl}
                            alt="Provider Image"
                            width={180}
                            height={180}
                            className="aspect-square w-44 h-44 rounded-full object-cover border-2 border-blue-300"
                        />
                    ) : (
                        <div className="w-44 h-44 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            Sem imagem
                        </div>
                    )}
                </div>


                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Bem-vindo ao {providerData.name}!
                </h1>

                <div className="space-y-4">
                    <div className="py-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seu nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite seu nome..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número da mesa</label>
                        <input
                            type="number"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            placeholder="Ex: 12"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                    >
                        {loading ? "Enviando..." : "Confirmar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProviderWelcomePage
