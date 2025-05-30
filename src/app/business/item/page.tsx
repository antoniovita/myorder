"use client";
import { useEffect, useMemo, useState } from "react";
import {
  CloudUpload,
  Pencil,
  Plus,
  Trash2,
  Search as SearchIcon,
  X,
} from "lucide-react";
import Image from "next/image";

import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const DashboardItem = () => {
  interface Item {
    id: string;
    name: string;
    price: number;
    imgUrl: string;
    category: string;
    description: string;
  }

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [prevImageUrl, setPrevImageUrl] = useState("");
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);



const getImagePathFromUrl = (url: string) =>
  decodeURIComponent(url.split("/images/")[1] ?? "");


  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [items, searchTerm]
  );

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const response = await fetch("/api/token", { credentials: "include" });
        if (!response.ok) throw new Error("Falha ao obter credenciais");
        const data = await response.json();
        setToken(data.token || null);
        setProviderId(data.id || null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAuthData();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/item/?providerId=${providerId}`);
        if (!response.ok) throw new Error("A requisição falhou.");
        const data = await response.json();
        setItems(data);
        console.log(data)
      } catch (err) {
        console.error(err);
      }
    };
    if (providerId) fetchItems();
  }, [providerId]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    try {
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);
      if (!urlData?.publicUrl) throw new Error("Erro ao gerar URL da imagem");

      setImageUrl(urlData.publicUrl);
      setMessage("");
    } catch (err) {
      console.log(err)
      setMessage("❌ Erro ao fazer upload da imagem");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!token || !itemToDelete || !providerId) return;
  
    const filePath = getImagePathFromUrl(itemToDelete.imgUrl);
  
    try {
      const res = await fetch(`/api/item?id=${itemToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ providerId }),
      });
  
      if (!res.ok) throw new Error("Erro ao excluir o item.");
  
      if (filePath) {
        const { error: storageError } = await supabase.storage.from("images").remove([filePath]);
        if (storageError) {
          console.error("Erro ao remover imagem do storage:", storageError);
        }
      }
  
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      setMessage("✅ Item excluído com sucesso!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Erro ao excluir o item.");
    } finally {
      setItemToDelete(null);
    }
  };
  

  const formatBRL = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(v);
  

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setMessage("⚠️ Por favor, envie uma imagem antes de criar o item.");
      return;
    }

    try {
      const body = {
        name,
        price: parseFloat(price),
        description,
        imgUrl: imageUrl,
        providerId,
        category,
      };

      console.log(body)

      const res = await fetch("/api/item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Erro ao criar item.");

      setMessage("✅ Item criado com sucesso!");
      setName("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImageFile(null);
      setImageUrl("");
    } catch (err) {
      console.log(err);
      setMessage("❌ Erro ao criar item.");
    }
  };

  const openEditDialog = (item: Item) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.price.toString());
    setCategory(item.category);
    setDescription(item.description);
    setImageUrl(item.imgUrl);
    setPrevImageUrl(item.imgUrl);
    setIsEditDialogOpen(true);
  };
  

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !token) return;
  
    const body = {
      name,
      price: parseFloat(price),
      description,
      imgUrl: imageUrl,
      category,
      providerId,
    };
  
    const res = await fetch(`/api/item?id=${editingItem.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  
    if (!res.ok) {
      setMessage("❌ Erro ao atualizar o item.");
      return;
    }
  
    if (prevImageUrl && prevImageUrl !== imageUrl) {
      const oldPath = getImagePathFromUrl(prevImageUrl);
      if (oldPath) {
        await supabase.storage.from("images").remove([oldPath]);
      }
    }
  
    const updated: Item = await res.json();
    setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
  
    setMessage("✅ Item atualizado com sucesso!");
    setIsEditDialogOpen(false);
    setEditingItem(null);
  };
  

  if (!token || !providerId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-bold text-red-600">Você precisa estar logado.</p>
      </div>
    );
  }

  return (
    <>

      <Dialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o item{" "}
              <strong>{itemToDelete?.name}</strong>? Essa ação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setItemToDelete(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="hover:cursor-pointer"
              onClick={handleDeleteItem}
            >
              Sim, excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="flex w-full px-4 min-h-screen justify-center bg-gray-50">
        <div className="w-full max-w-screen-xl space-y-10">

        <div className="sticky top-4 z-30 pt-6">
            <div className="mx-auto w-full max-w-md">
              <div className="flex flex-row items-center gap-3 bg-white/90 shadow-sm ring-1 ring-gray-300 backdrop-blur-sm px-4 py-2 rounded-full transition ">
                <SearchIcon className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Pesquisar produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-sm placeholder-gray-400 focus:outline-none"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="text-gray-400 hover:text-gray-600 hover:cursor-pointer transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum produto encontrado.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="relative border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <Image
                    width={500}
                    height={500}
                    src={item.imgUrl}
                    alt={item.name}
                    className="w-full h-80 sm:h-60 object-cover"
                  />
                  <div className="p-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-normal text-gray-800 flex-1 line-clamp-1">
                        {item.name}
                      </h2>

                      <span className="text-xs font-medium bg-black text-white px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-3 py-1">
                      {item.description}
                    </p>
                    <div className="flex">
                      <p className="text-lg flex py-2 rounded-lg text-black font-lg">
                        {formatBRL(item.price)}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-white rounded-lg shadow-md p-2 px-3 flex gap-1.5">
                    <Pencil
                      className="w-5 h-5 text-blue-600 cursor-pointer"
                      onClick={() => openEditDialog(item)}
                    />
                    <Trash2
                      className="w-5 h-5 text-red-500 cursor-pointer"
                      onClick={() => setItemToDelete(item)}
                    />
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-4 right-4 sm:right-6 z-50 w-full sm:w-auto sm:bottom-6 flex justify-center sm:justify-end px-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r hover:cursor-pointer from-blue-600 to-blue-700 text-white font-medium p-4 rounded-full shadow-lg hover:brightness-110 transition-all flex items-center gap-2 sm:w-auto">
              <Plus className="w-5 h-5" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Adicionar Produto
              </DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para cadastrar um novo produto.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleCreateItem}>
              <div className="flex flex-col gap-1">
                <label className="text-sm">  Nome do produto:</label>
                <Input
                  placeholder="Spaghetti ao molho sugo..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm">  Preço:</label>
                <Input
                  type="number"
                  placeholder="45.99..."
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm">  Categoria:</label>
                <Input
                  placeholder="Massas..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm">  Descrição:</label>
                <Textarea
                  placeholder="Deliciosa especialidade de massa da casa..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <label
                htmlFor="upload"
                className="flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-xl p-4 hover:bg-gray-100 cursor-pointer transition"
              >
                <CloudUpload className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">
                  {imageFile ? "Imagem selecionada ✅" : "Selecionar imagem"}
                </span>
                <input
                  id="upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      handleImageUpload(file);
                    }
                  }}
                />
              </label>

              {imageUrl && (
                <Image
                  width={500}
                  height={500}
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg border"
                />
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:cursor-pointer hover:bg-blue-700 shadow-sm"
                disabled={uploading}
              >
                Salvar
              </Button>

              {message && (
                <p className="text-sm text-center text-red-500">{message}</p>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </div>


      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Editar Produto
            </DialogTitle>
            <DialogDescription>
              Atualize os dados do produto abaixo.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleEditItem}>

          <div className="flex flex-col gap-1">
                <label className="text-sm">  Nome do produto:</label>
                <Input
                  placeholder="Spaghetti ao molho sugo..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm">  Preço:</label>
                <Input
                  type="number"
                  placeholder="45.99..."
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm">  Categoria:</label>
                <Input
                  placeholder="Massas..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm">  Descrição:</label>
                <Textarea
                  placeholder="Deliciosa especialidade de massa da casa..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

            <label
              htmlFor="edit-upload"
              className="flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-xl p-4 hover:bg-gray-100 cursor-pointer transition"
            >
              <CloudUpload className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700">
                {imageFile ? "Nova imagem selecionada ✅" : "Selecionar nova imagem"}
              </span>
              <input
                id="edit-upload"
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    handleImageUpload(file);
                  }
                }}
              />
            </label>

            {imageUrl && (
              <Image
                height={500}
                width={500}
                src={imageUrl}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg border"
              />
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 hover:cursor-pointer shadow-sm"
              disabled={uploading}
            >
              Atualizar
            </Button>

            {message && (
              <p className="text-sm text-center text-red-500">{message}</p>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardItem;
