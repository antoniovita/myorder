'use client'
import { motion } from "framer-motion";

const steps = [
  { number: "1", title: "Cadastre-se", description: "Crie sua conta rapidamente e sem complicação." },
  { number: "2", title: "Monte o cardápio", description: "Adicione seus pratos com fotos e descrições." },
  { number: "3", title: "Compartilhe", description: "Use um QR Code ou link personalizado para mostrar seu cardápio." },
  { number: "4", title: "Venda mais", description: "Ofereça uma experiência moderna e aumente suas vendas." }
];

const HomeAdvantage = () => {
  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-10">

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 flex-wrap">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 50 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative flex flex-col items-center bg-orange-400 rounded-3xl shadow-xl w-[220px] h-[220px] p-4 text-center"
            >
              {/* Número no topo */}
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white text-black font-bold text-lg rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                {step.number}
              </div>

              {/* Conteúdo */}
              <h3 className="text-lg font-bold text-white mt-8">{step.title}</h3>
              <p className="text-sm text-white mt-2">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeAdvantage;
