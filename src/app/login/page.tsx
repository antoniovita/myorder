'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
    const router = useRouter();
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        email: '',
        password: '',
        cpf: '',
        phone: '',
        owner: ''
    });

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async () => {
        const action = isRegistering ? 'register' : 'login';
        const response = await fetch('http://localhost:3000/api/provider', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action,
                ...formData
            })
        });

        if (response.ok) {
            const data = await response.json();
            Cookies.set('token', data.token, { expires: 7 });
            router.push('/business');
        } else {
            console.error('Erro ao enviar dados');
        }
    };

    const handleGoogleLogin = () => {
        // Aqui você pode integrar com sua lógica OAuth do Google
        alert('Funcionalidade de login com Google ainda não implementada.');
    };

    return (
        <div className="min-h-screen flex items-center py-20 justify-center bg-gradient-to-br from-blue-800 to-blue-600 px-4">
            <div className="w-full max-w-2xl bg-white border border-gray-300 rounded-2xl shadow-2xl p-8">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-700" htmlFor="name">Nome do Restaurante</label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Ex: Pizzaria do João"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-800 outline-none"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-700" htmlFor="owner">Nome do Dono</label>
                                    <input
                                        id="owner"
                                        type="text"
                                        placeholder="João Silva"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-800 outline-none"
                                        value={formData.owner}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-700" htmlFor="phone">Telefone</label>
                                    <input
                                        id="phone"
                                        type="text"
                                        placeholder="(11) 98765-4321"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-800 outline-none"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-700" htmlFor="cpf">CPF</label>
                                    <input
                                        id="cpf"
                                        type="text"
                                        placeholder="000.000.000-00"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-800 outline-none"
                                        value={formData.cpf}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-700" htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="seuemail@exemplo.com"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-800 outline-none"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-700" htmlFor="password">Senha</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Crie uma senha segura"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-800 outline-none"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

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
                            <div>
                                <label className="text-sm text-gray-700" htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="seuemail@exemplo.com"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-800 outline-none"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-700" htmlFor="password">Senha</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Digite sua senha"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-800 outline-none"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
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
    );
};

export default LoginPage;
