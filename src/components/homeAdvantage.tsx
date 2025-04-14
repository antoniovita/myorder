'use client'
import { motion } from "framer-motion";

const steps = [
  { number: "1", title: "Cadastre-se", description: "Crie sua conta rapidamente e sem complicação." },
  { number: "2", title: "Monte o cardápio", description: "Adicione seus pratos com fotos e descrições atrativas." },
  { number: "3", title: "Compartilhe", description: "Use QR Code ou link personalizado para divulgar." },
  { number: "4", title: "Venda mais", description: "Modernize sua apresentação e aumente suas vendas." }
];

const HomeAdvantage = () => {
  return (
    <section className="bg-white py-10 mb-20 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-16">

        <h1 className='text-4xl text-blue-800 font-bold'> Como funciona? </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 50 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative flex flex-col items-center justify-center bg-gradient-to-br from-blue-800 to-blue-700 rounded-3xl shadow-2xl w-full h-[260px] p-6 text-center"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-blue-800 font-extrabold text-lg rounded-full w-12 h-12 flex items-center justify-center shadow-md border-2 border-blue-800">
                {step.number}
              </div>

              <h3 className="text-xl font-bold text-white mt-10">{step.title}</h3>
              <p className="text-base text-white mt-3 px-2">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeAdvantage;
