'use client';
import { useEffect, useState } from 'react';
import { CloudUpload, Pencil, Plus, PlusCircle, Trash2, Utensils } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';

const DashboardItem = () => {

  const tokenCookie = Cookies.get('token');
  const providerIdCookie = Cookies.get('id');
  
  if (!tokenCookie || !providerIdCookie) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-bold text-red-600">
          Você precisa estar logado.
        </p>
      </div>
    );
  }


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

    if (providerId) fetchItems();
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
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
      if (!urlData?.publicUrl) throw new Error('Erro ao gerar URL da imagem');
      setImagemUrl(urlData.publicUrl);
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
    <div className='bg-gray-100 flex w-full p-4 min-h-screen justify-center items-start'>
      <div className='bg-white p-4 rounded-2xl border border-gray-300 w-full space-y-6'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <Utensils className='text-blue-600' />
            <h1 className='text-2xl font-bold text-blue-600'>Produtos</h1>
                    </div>
                <Dialog>
                <DialogTrigger asChild>
                    <Button className='gap-2 bg-blue-600 text-white hover:bg-blue-700'>
                    <Plus className="w-4 h-4" /> Novo Produto
                    </Button>
                </DialogTrigger>
                <DialogContent className='max-w-md'>
                    <DialogHeader>
                    <DialogTitle className='text-lg font-semibold'>Adicionar Produto</DialogTitle>
                    </DialogHeader>
                    <form className='space-y-4' onSubmit={handleCreateItem}>
                    <Input
                        placeholder='Nome do Produto'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Input
                        type='number'
                        placeholder='Preço'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                    <Textarea
                        placeholder='Descrição'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <label
                        htmlFor='upload'
                        className='flex items-center justify-center gap-2 cursor-pointer border border-dashed border-gray-400 rounded-xl p-4 hover:bg-gray-100 transition'
                    >
                        <CloudUpload className='w-5 h-5 text-blue-600' />
                        <span className='text-sm text-gray-700'>
                        {imageFile ? 'Imagem selecionada ✅' : 'Selecionar imagem'}
                        </span>
                        <input
                        id='upload'
                        type='file'
                        className='hidden'
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                            setImageFile(file);
                            handleImageUpload(file);
                            }
                        }}
                        />
                    </label>

                    {imagemUrl && (
                        <img src={imagemUrl} alt='Preview' className='w-full h-40 object-cover rounded-lg border' />
                    )}

                    <Button type='submit' className='w-full bg-blue-600 hover:bg-blue-700' disabled={uploading}>
                        Salvar
                    </Button>

                    {message && (
                        <p className='text-sm text-center text-red-500'>{message}</p>
                    )}
                    </form>
                </DialogContent>
                </Dialog>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6'>
          {items.map((item) => (
            <div key={item.id} className='relative border border-gray-300 rounded-xl shadow-sm bg-white overflow-hidden'>
              <img src={item.imgUrl} alt={item.name} className='w-full h-48 object-cover' />
              <div className='p-4'>
                <h2 className='text-lg font-semibold text-gray-800'>{item.name}</h2>
                <p className='text-sm text-gray-600'>{item.description}</p>
                <p className='text-xl text-blue-700 font-bold mt-2'>R$ {item.price.toFixed(2)}</p>
              </div>
              <div className='absolute rounded-full bg-white p-2 top-[3%] right-[3%] flex gap-2'>
                <Pencil className='w-5 h-5 text-blue-600 cursor-pointer' />
                <Trash2 className='w-5 h-5 text-red-600 cursor-pointer' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardItem;
