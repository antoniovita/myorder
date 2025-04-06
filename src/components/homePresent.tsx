import Link from "next/link";
import Image from "next/image";
import { CornerDownRight } from "lucide-react";

const HomePresent = () => {
  return (
    <section className="bg-white py-16 px-4 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col-reverse md:flex-row items-center gap-12">

        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Crie um <span className="text-blue-400">Cardápio Digital</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
            Transforme a experiência dos seus clientes com um cardápio digital interativo, bonito e fácil de usar.
            Modernize seu negócio com praticidade e estilo.
          </p>
          <div className="flex flex-row gap-4">
            <div className="flex mt-1 flex-row gap-4">
              <CornerDownRight className="text-blue-400" size={30} />
              <h1 className="mt-2 text-black font-semibold"> Faça a escolha certa</h1>
            </div>
            <Link
              href="/criar"
              className="bg-blue-400 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-blue-500 transition"
            >
              Crie agora
            </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <Image
            src="/homeImage.png"
            width={400}
            height={400}
            alt="Cardápio Digital"
            className="w-full max-w-xs md:max-w-sm"
          />
        </div>
      </div>
    </section>
  );
};

export default HomePresent;
