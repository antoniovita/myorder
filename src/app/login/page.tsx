'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react';

const LoginPage = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen flex flex-col md:flex-row justify-center gap-10 items-center bg-white px-4 relative">
            {!isMobile && 
            <div className='mt-6'>
                <div className='w-[90px] h-[90px] bg-yellow-400 rounded-full absolute z-30 top-[25%] right-[64%] animate-floating'></div>
                <div className='w-[150px] h-[150px] bg-yellow-400 flex justify-center items-center rounded-full absolute z-30 top-[12%] right-[70%] animate-floating'>
                    <Image src={'/thinking1.png'} alt={''} width={100} height={100} />
                </div>
                <div className='w-[50px] h-[50px] bg-yellow-400 rounded-full absolute z-30 top-[29%] right-[60%] animate-floating'></div>
                <div className='w-[30px] h-[30px] bg-yellow-400 rounded-full absolute z-30 top-[35%] right-[58%] animate-floating'></div>

                 <Image src={'/loginImage.png'} alt={''} width={400} height={400} />
            </div>
            }
            <div className="w-full max-w-sm bg-white border border-gray-300 rounded-2xl shadow-lg p-6 flex flex-col items-center">
                <h1 className="font-bold text-xl mb-4 text-gray-800">Crie uma conta!</h1>
                <p className="text-gray-600 text-sm mb-4">Entre com seu email e senha para continuar</p>
                <div className="w-full">
                    <div className="flex flex-col gap-2 mb-3">
                        <label htmlFor="email" className="text-gray-700 text-sm">Email</label>
                        <input 
                            id="email" 
                            type="email" 
                            placeholder="carlos@example.com" 
                            className="w-full border-gray-300 text-black border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-col gap-2 mb-3">
                        <label htmlFor="password" className="text-gray-700 text-sm">Senha</label>
                        <input 
                            id="password" 
                            type="password" 
                            placeholder="Insira sua senha..." 
                            className="w-full border-gray-300 border text-black rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <button className="w-full bg-yellow-400 hover:bg-yellow-600 text-black font-semibold py-2 rounded-xl mt-2 transition duration-300">Criar Conta</button>
                </div>
                <p className="text-gray-600 text-sm mt-4">Já tem uma conta? <a href="#" className="text-blue-500 hover:underline">Faça login</a></p>
            </div>

            <style jsx>{`
            @keyframes floating {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-10px);
                }
            }

            .animate-floating {
                animation: floating 3s ease-in-out infinite;
            }
            `}</style>
        </div>
    );
}
 
export default LoginPage;
