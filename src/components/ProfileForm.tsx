"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { UploadCloud } from "lucide-react";

const ProfileForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [owner, setOwner] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [providerId, setProviderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthAndProviderData = async () => {
      setError("");
      try {
        const response = await fetch("/api/token", { credentials: "include" });
        if (!response.ok) throw new Error("Falha ao obter credenciais");
        const data = await response.json();
        const userToken = data.token || null;
        const userId = data.id || null;

        setToken(userToken);
        setProviderId(userId);

        if (!userToken || !userId) return;

        const providerRes = await fetch(`/api/provider?id=${userId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (!providerRes.ok) throw new Error("Erro ao carregar dados do perfil.");

        const providerData = await providerRes.json();

        setName(providerData.name || "");
        setDescription(providerData.description || "");
        setImgUrl(providerData.imgUrl || "");
        setCpf(providerData.cpf || "");
        setPhone(providerData.phone || "");
        setOwner(providerData.owner || "");
      } catch (err: any) {
        setError(err.message || "Erro ao buscar dados.");
      }
    };

    fetchAuthAndProviderData();
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
        body: JSON.stringify({ name, description, imgUrl, cpf, phone, owner, id: providerId }),
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
    <div className="w-full h-full p-6 bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">Meu Perfil</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}
      {message && <p className="text-blue-600 mb-2">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="gap-3 flex flex-col">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </div>

        <div className="gap-3 flex flex-col">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </div>

        <div className="gap-3 flex flex-col">
          <Label htmlFor="phone">Número</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </div>

        <div className="gap-3 flex flex-col">
          <Label htmlFor="owner">Dono</Label>
          <Input
            id="owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </div>

        <div className="gap-3 flex flex-col">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </div>

        <div>
          <Label>Foto de Perfil</Label>

          <div className="flex items-start flex-col gap-4 mt-2">
            <label className="cursor-pointer flex items-center gap-4 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg font-medium hover:bg-orange-200 transition">
              <UploadCloud size={18} />
              {uploading ? "Enviando..." : "Selecionar Imagem"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                }}
                disabled={uploading || loading}
                hidden
              />
            </label>

            {imgUrl && (
              <div className="relative w-20 h-20">
                <Image
                  src={imgUrl}
                  alt="Foto de Perfil"
                  fill
                  className="object-cover border"
                />
              </div>
            )}
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;
