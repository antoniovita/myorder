"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ProviderWelcomePage = () => {
    const Router = useRouter();
    const params = useParams();
    const providerId = params?.providerId as string; 
    console.log("Provider ID:", providerId);

    const [providerData, setProviderData] = useState<{ name?: string }>({});
    const [name, setName] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Busca dados do provedor
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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Erro ao criar usuário.");
            }

            Router.push(`/provider-page/${providerId}/items`);
            setName("");
            setTableNumber("");
        } catch (err) {
            setError("Falha ao criar usuário. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl text-black font-bold mb-4 text-center">
                    Bem-vindo ao {providerData.name}!
                </h1>
                
                <div className="flex flex-col gap-4">
                    <label className="font-medium text-gray-700">Nome</label>
                    <input
                        type="text"
                        placeholder="Insira seu nome..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border text-black border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />

                    <label className="font-medium text-gray-700">Número da Mesa</label>
                    <input
                        type="number"
                        placeholder="Insira a mesa..."
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="border text-black border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        className="bg-yellow-400 text-black font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500 transition"
                        disabled={loading}
                    >
                        {loading ? "Enviando..." : "Confirmar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProviderWelcomePage;
