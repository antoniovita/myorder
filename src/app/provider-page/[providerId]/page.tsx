"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const ProviderWelcomePage = () => {
    const searchParams = useSearchParams();
    const providerId = searchParams.get("id");
    const [error, setError] = useState('')

    const [providerData, setProviderData] = useState<{ name?: string }>({});
    const [name, setName] = useState("");
    const [tableNumber, setTableNumber] = useState("");

    useEffect(() => {
        if (providerId) {
            fetch(`/api/?id=${providerId}`)
                .then((res) => res.json())
                .then((data) => setProviderData(data))
                .catch((err) => console.error("Erro ao buscar dados do provedor:", err));
        }
    }, [providerId]);

    const handleCreateUser = async () => {
        if (!name) {
            setError
        }

    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl text-black font-bold mb-4 text-center">
                    Bem-vindo, {providerData.name || "Cliente"}!
                </h1>
                
                <div className="flex flex-col gap-4">
                    <label className="font-medium text-black">Nome</label>
                    <input
                        type="text"
                        placeholder="Insira seu nome..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 text-black rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />

                    <label className="font-medium text-black">Número da Mesa</label>
                    <input
                        type="number"
                        placeholder="Insira a mesa..."
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="border text-black border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        className="bg-yellow-400 text-black font-semibold py-2 px-4 rounded-lg hover:bg-yewllow-700 transition"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProviderWelcomePage;
