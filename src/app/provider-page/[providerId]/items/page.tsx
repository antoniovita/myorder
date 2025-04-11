'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from '@/hooks/useCart';
import { Minus, Plus } from "lucide-react";

interface Item {
  id: string;
  name: string;
  price: number;
  imgUrl: string;
  category: string;
  description: string;
}

export default function ItemsPage() {
  const { addToCart, cartItems } = useCart();
  const providerId = useParams()?.providerId as string;
  const [items, setItems] = useState<Item[]>([]);
  const [quantities, setQuantities] = useState<{ [itemId: string]: number }>({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/item/?providerId=${providerId}`);
        if (!response.ok) throw new Error("A requisição falhou.");
        const data = await response.json();
        setItems(data);

        const initialQuantities: { [itemId: string]: number } = {};
        data.forEach((item: Item) => {
          initialQuantities[item.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Erro no fetch dos produtos.", error);
      }
    };

    fetchItems();
  }, [providerId]);

  const handleQuantityChange = (itemId: string, delta: number) => {
    setQuantities((prev) => {
      const newQty = Math.max(1, (prev[itemId] || 1) + delta);
      return { ...prev, [itemId]: newQty };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-12 px-6">
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
                    <p className="text-xl font-bold text-black">R$ {item.price.toFixed(2)}</p>
                    <div className="flex space-x-4">
                      <div className="flex items-center border rounded-xl overflow-hidden">
                        <button
                          className="px-3 py-1 text-lg font-bold text-gray-700 transition"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 py-1 text-md font-medium text-gray-800 bg-white">
                          {quantities[item.id] || 1}
                        </span>
                        <button
                          className="px-3 py-1 text-lg font-bold text-gray-700 transition"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          for (let i = 0; i < (quantities[item.id] || 1); i++) {
                            addToCart(item);
                          }
                          console.log('Item adicionado:', item, 'quantidade:', quantities[item.id]);
                        }}
                        className="text-sm bg-green-600 py-3 text-white px-4 rounded-xl font-medium hover:underline"
                      >
                        Adicionar
                      </button>
                    </div>
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
