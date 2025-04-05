'use client';

import { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";

const ItemsPage = () => {

    interface Item {
        id: string,
        name: string,
        price: number,
        imgUrl: string,
        category: string,
        description: string
    }

    const providerId = useParams()?.providerId as string;
    console.log("Provider ID:", providerId);
    const [items, setItems] = useState<Item[]>([])
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`/api/item/?providerId=${providerId}`);
                if (!response.ok) {
                    throw new Error("A requisição falhou.");
                }
                const data = await response.json();
                console.log("Items data:", data);
            } catch (error) {
                console.error("Erro no fetch dos produtos.", error);
            }
        };
        fetchItems();
    }, []);

    return ( 
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <h1>Items</h1>
            <div className="grid grid-cols-3 gap-4">
                {items.map((item) => (
                    <div key={item.id} className="border p-4 rounded">
                        <img src={item.imgUrl} alt={item.name} className="w-full h-32 object-cover mb-2" />
                        <h2 className="text-lg font-semibold">{item.name}</h2>
                        <p>{item.description}</p>
                        <p className="text-green-500 font-bold">${item.price}</p>
                    </div>
                ))}
            </div>
        </div>
     );
}
 
export default ItemsPage;