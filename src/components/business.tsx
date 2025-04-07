import { CheckCircle } from "lucide-react";

const BusinessComponent = () => {
  return (
    <section className="bg-white py-16 px-6 flex justify-center">
      <div className="max-w-5xl w-full text-center md:text-left flex flex-col md:flex-row items-center gap-10">

        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Dashboard ideal para o <span className="text-orange-400">seu negócio</span>
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Transforme a experiência dos seus clientes com um cardápio digital
            moderno, interativo e acessível de qualquer dispositivo.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Fácil de atualizar em tempo real",
              "Visual atrativo e responsivo",
              "Compatível com smartphones e tablets",
              "Sem necessidade de impressão",
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="text-orange-400 w-6 h-6 mt-1" />
                <span className="text-gray-700 text-md mt-1">{item}</span>
              </div>
            ))}
          </div>

        </div>

        <div className="flex-1">
          <img
            src="https://res.cloudinary.com/demo/image/upload/sample.jpg"
            alt="Mockup de Cardápio Digital"
            className="rounded-2xl shadow-lg w-full max-w-md mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default BusinessComponent;
