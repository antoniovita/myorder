'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const LoginPage = () => {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        email: '',
        password: '',
        cpf: '',
        phone: '',
        owner: '' // novo campo
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    return (
        <div className="min-h-screen flex flex-col md:flex-row justify-center gap-10 items-center bg-white px-4 relative">
            {!isMobile && 
            <div className='mt-6'>
                <Image src={'/thinking1.png'} alt={''} width={400} height={400} />
            </div>
            }
            <div className="w-full max-w-sm bg-white border border-gray-300 rounded-2xl mt-10 shadow-lg p-6 flex flex-col items-center">
                <h1 className="font-bold text-xl mb-4 text-gray-800">{isRegistering ? 'Crie uma conta!' : 'Faça login'}</h1>
                <p className="text-gray-600 text-sm mb-4">
                    {isRegistering ? 'Preencha os campos abaixo para se registrar.' : 'Entre com seu email e senha para continuar'}
                </p>
                <div className="w-full">
                    {isRegistering && (
                        <>
                            <div className="flex flex-col gap-2 mb-3">
                                <label htmlFor="name" className="text-gray-700 text-sm">Nome do Restaurante</label>
                                <input 
                                    id="name" 
                                    type="text" 
                                    placeholder="Seu restaurante" 
                                    className="w-full border-gray-300 text-black border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2 mb-3">
                                <label htmlFor="owner" className="text-gray-700 text-sm">Nome do Dono</label>
                                <input 
                                    id="owner" 
                                    type="text" 
                                    placeholder="Nome completo do dono" 
                                    className="w-full border-gray-300 text-black border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                    value={formData.owner}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2 mb-3">
                                <label htmlFor="description" className="text-gray-700 text-sm">Descrição</label>
                                <input 
                                    id="description" 
                                    type="text" 
                                    placeholder="Fale um pouco sobre seu negócio..." 
                                    className="w-full border-gray-300 text-black border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2 mb-3">
                                <label htmlFor="cpf" className="text-gray-700 text-sm">CPF</label>
                                <input 
                                    id="cpf" 
                                    type="text" 
                                    placeholder="000.000.000-00" 
                                    className="w-full border-gray-300 text-black border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2 mb-3">
                                <label htmlFor="phone" className="text-gray-700 text-sm">Telefone</label>
                                <input 
                                    id="phone" 
                                    type="text" 
                                    placeholder="(21) 91234-5678" 
                                    className="w-full border-gray-300 text-black border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}
                    <div className="flex flex-col gap-2 mb-3">
                        <label htmlFor="email" className="text-gray-700 text-sm">Email</label>
                        <input 
                            id="email" 
                            type="email" 
                            placeholder="carlos@example.com" 
                            className="w-full border-gray-300 text-black border rounded-xl px-3 py-2 focus:ring-1 focus:ring-gray-500 focus:outline-none"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2 mb-3">
                        <label htmlFor="password" className="text-gray-700 text-sm">Senha</label>
                        <input 
                            id="password" 
                            type="password" 
                            placeholder="Insira sua senha..." 
                            className="w-full border-gray-300 border text-black rounded-xl px-3 py-2 focus:ring-1 focus:ring-gray-500 focus:outline-none"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button 
                        className="w-full bg-orange-400 hover:bg-orange-600 text-white font-semibold py-2 rounded-xl mt-2 transition duration-300"
                        onClick={handleSubmit}
                    >
                        {isRegistering ? 'Criar Conta' : 'Entrar'}
                    </button>
                </div>
                <p className="text-gray-600 text-sm mt-4">
                    {isRegistering ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}
                    <button onClick={() => setIsRegistering(!isRegistering)} className="text-blue-500 hover:underline ml-1">
                        {isRegistering ? 'Faça login' : 'Crie uma conta'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
