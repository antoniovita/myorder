"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { ChevronDown, Minus, Plus, Search } from "lucide-react";

interface Item {
  id: string;
  name: string;
  price: number;
  imgUrl: string;
  category: string;
  description: string;
}

export default function ItemsPage() {
  const { addToCart } = useCart();
  const providerId = useParams()?.providerId as string;
  const [items, setItems] = useState<Item[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");

  const categories = useMemo(() => {
    const set = new Set(items.map(i => i.category));
    return Array.from(set).sort();
  }, [items]); 


  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`/api/item/?providerId=${providerId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setItems(data);
        const initial: Record<string, number> = {};
        data.forEach((i: Item) => (initial[i.id] = 1));
        setQuantities(initial);
      } catch (err) {
        console.error("Erro no fetch dos produtos.", err);
      }
    };
    fetchItems();
  }, [providerId]);

  const filtered = useMemo(
    () =>
      items.filter(
        i =>
          i.name.toLowerCase().includes(search.trim().toLowerCase()) &&
          (category === "" || i.category === category)
      ),
    [items, search, category]
  );
  

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities((q) => ({ ...q, [id]: Math.max(1, (q[id] || 1) + delta) }));
  };

  const handleAddToCart = (item: Item) => {
    const qty = quantities[item.id] || 1;
    for (let i = 0; i < qty; i++) addToCart(item);
    setAddedProductId(item.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  const formatBRL = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <div className="min-h-screen from-white to-blue-50 px-6">
      <div className="max-w-6xl mx-auto w-full space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-4 sticky top-4 z-30 pb-4">

      <div className="flex flex-1 items-center gap-2 bg-white/90 backdrop-blur ring-1 ring-gray-200 px-5 py-2.5 rounded-full">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Pesquisar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm md:text-base placeholder-gray-400 bg-transparent focus:outline-none"
        />
      </div>


      {categories.length > 0 && (
        <div className="relative flex-1 sm:flex-none">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`w-full pl-4 pr-10 py-2.5 rounded-full border bg-white/90 backdrop-blur
            focus:outline-none appearance-none transition
            text-gray-400 sm:text-base text-sm`}
        >
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>      
      )}
    </div>


        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
              >
                <div className="relative w-full h-48">
                  <Image src={item.imgUrl} alt={item.name} fill className="object-cover" />
                </div>
                <div className="p-5 flex-1 flex flex-col gap-4">
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-gray-800 line-clamp-1">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <p className="text-lg font-medium text-gray-900">
                      {formatBRL(item.price)}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-lg py-2 bg-gray-100">
                        <button
                          className="px-2 text-gray-700 disabled:opacity-40"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={quantities[item.id] === 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-medium text-gray-800">
                          {quantities[item.id] || 1}
                        </span>
                        <button
                          className="px-2 text-gray-700"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`px-4 py-2 rounded-lg hover:cursor-pointer text-sm font-semibold text-white transition ${
                          addedProductId === item.id ? "bg-blue-900" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {addedProductId === item.id ? "Adicionado" : "Adicionar"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-16 text-base">Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
}
