'use client';
import { useEffect, useState } from 'react';
import { Pencil, PlusCircle, Trash2, Utensils } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DashboardItem = () => {

        
        interface Item {
            id: string;
            name: string;
            price: number;
            imgUrl: string;
            category: string;
            description: string;
        }

        const [name, setName] = useState('');
        const [price, setPrice] = useState('');
        const [description, setDescription] = useState('');
        const [imageFile, setImageFile] = useState<File | null>(null);
        const [imagemUrl, setImagemUrl] = useState('');
        const [message, setMessage] = useState('');
        const [error, setError] = useState('');
        const [uploading, setUploading] = useState(false);
        const [token, setToken] = useState<string | null>(null);
        const [providerId, setProviderId] = useState<string | null>(null);
        const [items, setItems ] = useState<Item[]>([])

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
    
                setImagemUrl(urlData.publicUrl);
                console.log(urlData.publicUrl)
                setMessage('');
            } catch (err) {
                console.error(err);
                setMessage('❌ Erro ao fazer upload da imagem');
            } finally {
                setUploading(false);
            }
        };
    
        const handleCreateItem = async (e: any) => {
            e.preventDefault();
    
            if (!imagemUrl) {
                setMessage('⚠️ Por favor, envie uma imagem antes de criar o item.');
                return;
            }
    
            try {
                const res = await fetch('/api/item', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name,
                        price: parseFloat(price),
                        description,
                        imgUrl: imagemUrl,
                        providerId,
                    }),
                });
    
                if (!res.ok) throw new Error('Erro ao criar item.');
    
                setMessage('✅ Item criado com sucesso!');
                setName('');
                setPrice('');
                setDescription('');
                setImageFile(null);
                setImagemUrl('');
            } catch (error: any) {
                setMessage(`❌ ${error.message}`);
            }
        };

    return ( 
    <div className='bg-gray-100 flex w-full p-4 min-h-screen'>
        <div className=' bg-white  p-3 rounded-2xl border border-gray-300 w-full max-w-7xl space-y-6'>
        <div className='flex justify-between flex-row px-3 py-2'>
            <div className="flex flex-row gap-2">
            <Utensils className="text-blue-600 mt-1.5" /> 
            <h1 className="text-3xl font-bold text-gray-800">Produtos</h1>
            </div>
            
            <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition-colors"
            >
            <PlusCircle className="w-5 h-5" />
            Novo
            </button>

        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {items.map((item) => (
            <div key={item.id} className='border border-gray-300 rounded-lg relative shadow-sm bg-gray-50'>
                <img src={item.imgUrl} alt={item.name} className='w-full h-40 object-cover rounded-md' />
                <div className='p-3'>
                <h2 className='text-lg font-semibold text-black'>{item.name}</h2>
                <p className='text-sm text-black'>{item.description}</p>
                <p className='text-xl text-blue-700 font-bold mb-1'>R$ {item.price.toFixed(2)}</p>
                </div>
                <div className='absolute top-2 bg-white border-gray-300 border rounded-full px-3 py-2   right-2 flex gap-2'>
                <button
                    onClick={() => {
                    const el = document.getElementById(`edit-${item.id}`);
                    if (el) el.classList.toggle('hidden');
                    }}
                >
                    <Pencil className='w-4 h-4 text-blue-600 hover:text-blue-800' />
                </button>
                <button onClick={() => console.log(item.id)}>   
                    <Trash2 className='w-4 h-4 text-red-600 hover:text-red-800' />
                </button>
                </div>

                <div id={`edit-${item.id}`} className='hidden mt-4 bg-gray-100 text-black rounded-lg p-2'>
                <input type="text" defaultValue={item.name} className='w-full mb-1 p-1 text-black bg-gray-200 border mt-2 border-gray-300 rounded-2xl px-3' />
                <input type="number" defaultValue={item.price} className='w-full mb-1 p-1 text-black bg-gray-200 border mt-2 border-gray-300 rounded-2xl px-3' />
                <textarea defaultValue={item.description} className='w-full mb-1 p-1 text-black bg-gray-200 border mt-2 border-gray-300 rounded-2xl px-3' />
                <button className='bg-blue-500 text-white px-3 py-2 rounded-xl text-sm w-[100%] hover:bg-blue-600 '>
                    Salvar
                </button>
                </div>
            </div>
            ))}
        </div>
        </div>
    </div>
);

}
 
export default DashboardItem;