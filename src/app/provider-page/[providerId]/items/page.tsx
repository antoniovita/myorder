'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Home, LayoutDashboard } from "lucide-react";

interface Item {
  id: string;
  name: string;
  price: number;
  imgUrl: string;
  category: string;
  description: string;
}

export default function ItemsPage() {
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
  }, [providerId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-12 px-6">
      {/* Navigation */}
      <div className="max-w-6xl mx-auto mb-10">
        <nav className="flex justify-center gap-6 flex-wrap text-gray-700 font-medium text-base">
          <Link href="/" className="flex items-center gap-2 hover:text-blue-600 transition">
            <Home size={18} /> Início
          </Link>
          <Link href="/cart" className="flex items-center gap-2 hover:text-blue-600 transition">
            <ShoppingCart size={18} /> Carrinho
          </Link>
          <Link
            href={`/provider/${providerId}/dashboard`}
            className="flex items-center gap-2 hover:text-blue-600 transition"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
        </nav>
      </div>

      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Produtos Disponíveis</h1>
        <p className="text-gray-500 mt-2">Confira os itens que você pode oferecer aos clientes</p>
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={item.imgUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-sm text-gray-600 mt-1 mb-3">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-lg font-bold text-blue-600">R$ {item.price.toFixed(2)}</p>
                    <button className="text-sm text-blue-600 font-medium hover:underline">
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-16 text-lg">Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
}
