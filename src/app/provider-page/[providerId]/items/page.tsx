'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const ItemsPage = () => {
    interface Item {
        id: string;
        name: string;
        price: number;
        imgUrl: string;
        category: string;
        description: string;
    }

    const providerId = useParams()?.providerId as string;
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`/api/item/?providerId=${providerId}`);
                if (!response.ok) throw new Error("A requisição falhou.");
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error("Erro no fetch dos produtos.", error);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-10 px-6">
            <div className="max-w-6xl mt-8 mx-auto mb-10">
                <nav className="flex flex-wrap justify-center gap-6 ">
                    <Link
                        href="/"
                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                        Início
                    </Link>
                    <Link
                        href="/cart"
                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                        Carrinho
                    </Link>
                    <Link
                        href={`/provider/${providerId}/dashboard`}
                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                        Dashboard
                    </Link>
                </nav>
            </div>

            {/* Produtos */}
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Produtos Disponíveis</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden border border-gray-200"
                        >
                            <div className="relative w-full h-48">
                                <Image
                                    src={item.imgUrl}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="p-5">
                                <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                                <p className="text-sm text-gray-600 my-2">{item.description}</p>
                                <p className="text-lg font-bold text-blue-600">R$ {item.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {items.length === 0 && (
                    <p className="text-center text-gray-500 mt-10">Nenhum produto encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default ItemsPage;
