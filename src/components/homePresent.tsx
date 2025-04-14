import Link from "next/link";
import Image from "next/image";
import { CornerDownRight } from "lucide-react";

const HomePresent = () => {
  return (
    <section className="bg-blue-800 min-h-screen py-24 px-6 flex items-center justify-center">
      <div className="w-full max-w-6xl flex flex-col-reverse md:flex-row items-center gap-16">
        
        {/* Texto */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Crie agora o seu <span className="text-yellow-300">cardápio digital</span>
          </h1>

          <p className="text-xl text-gray-100 leading-relaxed max-w-2xl">
            Transforme a experiência dos seus clientes com um cardápio digital interativo, bonito e fácil de usar.
            Modernize seu negócio com praticidade, estilo e tecnologia.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-3">
              <CornerDownRight className="text-yellow-300" size={32} />
              <span className="text-white text-lg font-semibold">
                Faça a escolha certa
              </span>
            </div>

            <Link
              href="/criar"
              className="bg-white text-blue-800 text-lg font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-gray-100 transition"
            >
              Crie agora
            </Link>
          </div>
        </div>

        {/* Imagem */}
        <div className="absolute top-[30.5%] right-[10%]">
          <Image
            src="/chef.png"
            width={500}
            height={500}
            alt="Cardápio Digital"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md drop-shadow-xl"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HomePresent;
