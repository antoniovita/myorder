import Image from "next/image";
import Link from "next/link";

const AboutUs = () => {
  return (
    <section className="bg-white py-16 px-4 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col-reverse md:flex-row items-center gap-12">

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Um pouco sobre <span className="text-orange-400">nós</span>
          </h1>
          <p className="text-lg text-gray-600 mt-6 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae assumenda
            odio voluptatibus inventore aliquid pariatur, labore fugiat nulla, nemo
            delectus voluptatem explicabo. Laudantium delectus odit ipsum repellat
            ipsam! Deleniti, impedit.
          </p>

        </div>

        <div className="flex-1 flex justify-center">
          <Image
            src="/cowork.png"
            width={400}
            height={400}
            alt="Sobre nós"
            className=" w-full max-w-sm object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
