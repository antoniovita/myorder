"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, ImagePlus, CheckCircle, AlertCircle, UserRound } from "lucide-react";

const AccountPage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [providerId, setProviderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthData = async () => {
      setError("");
      try {
        const response = await fetch("/api/token", { credentials: "include" });
        if (!response.ok) throw new Error("Falha ao obter credenciais");
        const data = await response.json();
        setToken(data.token || null);
        setProviderId(data.id || null);
      } catch {
        setError("Erro ao buscar credenciais.");
      }
    };
    fetchAuthData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Token ausente. Você precisa estar logado.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/provider", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, imgUrl, id: providerId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar informações.");
      }

      setSuccess("Informações atualizadas com sucesso!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);

      if (!urlData?.publicUrl) throw new Error("Erro ao gerar URL da imagem");

      setImgUrl(urlData.publicUrl);
      setMessage("Imagem enviada com sucesso!");
    } catch (err) {
      console.error(err);
      setMessage("Erro ao fazer upload da imagem");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen py-19 bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 border-r p-6">
        <div className="mb-8 flex flex-row gap-2">
          <div className="text-xl font-bold text-gray-800 flex justify-center items-center  ">
          <div className="bg-orange-500 p-2 flex items-center justify-center rounded-full"><UserRound size={20} color='white' /></div></div>
          <h1 className="mt-2 text-black"> @carlosdasilva</h1>
        </div>
        <nav className="space-y-2">
          <div className="text-sm text-gray-500 font-semibold">Minha Conta</div>
          <ul className="space-y-1 ml-2 text-gray-700">
            <li className="font-bold text-red-600">Perfil</li>
            <li>Cartões / Contas Bancárias</li>
            <li>Trocar Senha</li>
            <li>Preferências de Cookies</li>
            <li>Configurações de Privacidade</li>
          </ul>
          <div className="text-sm text-gray-500 mt-6 font-semibold">Assinaturas</div>
          <ul className="space-y-1 ml-2 text-gray-700">
            <li>Meu plano</li>
            <li>Novas ofertas</li>
          </ul>
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 p-10">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Meu Perfil</h1>
        <p className="text-gray-500 mb-6">Gerenciar e proteger sua conta</p>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome de usuário</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              placeholder="Ex: antonio.vita"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              placeholder="Fale um pouco sobre você..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Imagem de perfil</label>
            <input
              type="file"
              onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
              className="mt-2"
            />
            {uploading && <Loader2 className="animate-spin text-gray-500 mt-2" />}
            {imgUrl && <img src={imgUrl} alt="Preview" className="mt-4 h-24 rounded-full" />}
            {message && <p className="text-sm mt-2 text-gray-600">{message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
          {error && (
            <div className="text-red-600 flex items-center gap-2">
              <AlertCircle size={18} /> {error}
            </div>
          )}
          {success && (
            <div className="text-green-600 flex items-center gap-2">
              <CheckCircle size={18} /> {success}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AccountPage;