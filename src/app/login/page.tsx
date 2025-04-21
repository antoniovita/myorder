'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { FcGoogle } from 'react-icons/fc';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import BackgroundCanvas from '@/components/BackgroundCanvas';

const LoginPage = () => {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    password: '',
    cpf: '',
    cnpj: '',
    phone: '',
    owner: '',
    address: ''
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async () => {
    const action = isRegistering ? 'register' : 'login';
    const url = 'http://localhost:3000/api/provider';

    let payload;
    if (isRegistering) {
      payload = {
        action,
        name: formData.name,
        description: formData.description,
        email: formData.email,
        password: formData.password,
        cpf: formData.cpf,
        cnpj: formData.cnpj,
        phone: formData.phone,
        owner: formData.owner,
        address: formData.address
      };
    } else {
      payload = {
        action,
        email: formData.email,
        password: formData.password
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          Cookies.set('token', data.token, { expires: 7 });
          setSuccess('Login realizado com sucesso! Redirecionando...');
          setTimeout(() => {
            router.push('/business');
          }, 1500);
        } else {
          setError('Token não recebido. Algo deu errado.');
        }
      } else {
        setError(data.message || 'Erro ao enviar dados');
      }
    } catch (error) {
      console.error('[ERRO] Falha na requisição:', error);
      setError('Erro inesperado. Verifique o console para detalhes.');
    }
  };

  const handleGoogleLogin = () => {
    setMessage('Funcionalidade de login com Google ainda não implementada.');
  };

  return (
    <>
      <BackgroundCanvas />


      <Dialog open={!!error} onOpenChange={() => setError('')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle size={20} /> Erro
            </DialogTitle>
            <DialogDescription className="text-gray-700">{error}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={!!success} onOpenChange={() => setSuccess('')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center gap-2">
              <CheckCircle size={20} /> Sucesso
            </DialogTitle>
            <DialogDescription className="text-gray-700">{success}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={!!message} onOpenChange={() => setMessage('')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-blue-600 flex items-center gap-2">
              <Info size={20} /> Informação
            </DialogTitle>
            <DialogDescription className="text-gray-700">{message}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen flex items-center py-20 justify-center bg-gradient-to-br from-blue-800 to-blue-600 px-4">
        <div className="w-full max-w-3xl bg-white border border-gray-300 rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-blue-800 mb-2">
            {isRegistering ? 'Crie sua conta' : 'Faça login'}
          </h1>
          <p className="text-center text-sm text-gray-500 mb-6">
            {isRegistering
              ? 'Preencha os campos para registrar seu restaurante.'
              : 'Entre com seu email e senha'}
          </p>

          <div className="space-y-4">
            {isRegistering ? (
              <>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InputField label="Nome do Restaurante" id="name" value={formData.name} onChange={handleChange} placeholder="Ex: Pizzaria do João" />
                  <InputField label="Nome do Dono" id="owner" value={formData.owner} onChange={handleChange} placeholder="João Silva" />
                  <InputField label="Telefone" id="phone" value={formData.phone} onChange={handleChange} placeholder="(11) 98765-4321" />
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InputField label="Endereço" id="address" value={formData.address} onChange={handleChange} placeholder="Rua Exemplo, 123" />
                  <InputField label="CNPJ" id="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" />
                  <InputField label="CPF" id="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" />
                </div>


                <InputField label="Email" id="email" value={formData.email} onChange={handleChange} placeholder="seuemail@exemplo.com" />


                <InputField label="Senha" id="password" type="password" value={formData.password} onChange={handleChange} placeholder="Crie uma senha segura" />


                <div>
                  <label className="text-sm text-gray-700" htmlFor="description">Descrição do Restaurante</label>
                  <textarea
                    id="description"
                    placeholder="Fale um pouco sobre o seu negócio..."
                    className="w-full h-28 border border-gray-300 rounded-xl px-4 py-2 resize-none focus:ring-2 focus:ring-blue-800 outline-none"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : (
              <>
                <InputField label="Email" id="email" type="email" value={formData.email} onChange={handleChange} placeholder="seuemail@exemplo.com" />
                <InputField label="Senha" id="password" type="password" value={formData.password} onChange={handleChange} placeholder="Digite sua senha" />
              </>
            )}

            <button
              className="w-full bg-blue-800 hover:bg-blue-900 hover:cursor-pointer text-white font-semibold py-3 rounded-xl transition duration-300"
              onClick={handleSubmit}
            >
              {isRegistering ? 'Registrar' : 'Entrar'}
            </button>

            <button
              className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="w-5 h-5" />
              {isRegistering ? 'Registrar com Google' : 'Entrar com Google'}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}
              <button
                className="ml-1 text-blue-500 hover:text-blue-800 hover:underline hover:cursor-pointer"
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering ? 'Faça login' : 'Cadastre-se'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const InputField = ({ label, id, value, onChange, placeholder, type = "text" }: any) => (
  <div>
    <label className="text-sm text-gray-700" htmlFor={id}>{label}</label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-800 outline-none"
      value={value}
      onChange={onChange}
    />
  </div>
);

export default LoginPage;
