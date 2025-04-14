import { CheckCircle } from "lucide-react";

const BusinessComponent = () => {
  return (
    <section className="bg-blue-900 py-20 px-6 flex justify-center">
      <div className="max-w-6xl w-full text-center md:text-left flex flex-col md:flex-row items-center gap-16">

        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-snug">
            Dashboard ideal para o <span className="text-yellow-400">seu negócio</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mt-6 max-w-xl">
            Um sistema completo e fácil de usar para você criar, editar e publicar seu cardápio digital em tempo real.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Fácil de atualizar em tempo real",
              "Visual atrativo e responsivo",
              "Compatível com smartphones e tablets",
              "Sem necessidade de impressão",
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="text-yellow-400 w-6 h-6 mt-1" />
                <span className="text-white text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <img
            src="https://res.cloudinary.com/demo/image/upload/sample.jpg"
            alt="Mockup de Cardápio Digital"
            className="rounded-2xl shadow-xl w-full max-w-md mx-auto border-4 border-yellow-400"
          />
        </div>
      </div>
    </section>
  );
};

export default BusinessComponent;
