import Image from "next/image";
import Link from "next/link";

const AboutUs = () => {
  return (
    <section className="bg-white py-20 px-4 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col-reverse md:flex-row items-center sm:gap-16">

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 leading-snug">
            Um pouco sobre <span className="text-blue-600">nós</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mt-6 leading-relaxed max-w-xl">
            Nós ajudamos restaurantes, cafés e negócios locais a modernizarem sua presença com cardápios digitais interativos, bonitos e fáceis de usar. Tudo isso sem complicações técnicas.
          </p>
          <Link
            href="/about"
            className="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold text-base hover:bg-blue-700 transition"
          >
            Saiba mais
          </Link>
        </div>

        <div className="flex-1 flex justify-center">
          <Image
            src="/cowork.png"
            width={500}
            height={500}
            alt="Sobre nós"
            className="w-full max-w-md rounded-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
