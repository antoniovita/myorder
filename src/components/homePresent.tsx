import Link from "next/link";
import Image from "next/image";
import { CornerDownRight } from "lucide-react";

const HomePresent = () => {
  return (
    <section className="relative bg-blue-800 min-h-screen md:min-h-[80vh] pt-32 md:pt-12 px-4 flex flex-col md:flex-row md:items-center md:justify-center justify-start overflow-hidden">
      
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-12">
        
        {/* Texto */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-6 z-10">
          <h1 className="text-[45px] sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Crie agora o seu <span className="text-yellow-300">cardápio digital</span>
          </h1>

          <p className="text-[18px] sm:text-lg text-gray-100 leading-relaxed max-w-xl">
            Transforme a experiência dos seus clientes com um cardápio digital interativo, bonito e fácil de usar.
            Modernize seu negócio com praticidade, estilo e tecnologia.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <CornerDownRight className="text-yellow-300" size={24} />
            <span className="text-white text-base sm:text-lg font-semibold">
              Faça a escolha certa
            </span>
          </div>

          <Link
            href="/criar"
            className="bg-white text-blue-800 text-base font-bold px-6 py-2 rounded-xl shadow-lg hover:bg-gray-100 transition"
          >
            Crie agora
          </Link>
        </div>

          <div className="mt-6 w-full max-w-xl md:hidden">
            <Image
              src="/chef.png"
              alt="Cardápio Digital"
              width={400}
              height={400}
              className="w-full h-auto object-contain drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </div>

      <div className="hidden md:block absolute bottom-0 right-10 lg:right-10 xl:right-20 2xl:right-60 w-[45%] max-w-[500px] lg:max-w-[450px] xl:max-w-[500px] 2xl:max-w-[600px] z-0">
        <Image
          src="/chef.png"
          alt="Cardápio Digital"
          width={500}
          height={500}
          className="w-full h-auto object-contain drop-shadow-xl"
          priority
        />
      </div>
    </section>
  );
};

export default HomePresent;
