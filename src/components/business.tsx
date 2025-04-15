import { CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const data = [
  { name: 'Jan', Gostaram: 400 },
  { name: 'Fev', Gostaram: 800 },
  { name: 'Mar', Gostaram: 1200 },
  { name: 'Abr', Gostaram: 1800 },
  { name: 'Mai', Gostaram: 2400 },
];

const BusinessComponent = () => {
  return (
    <section className="bg-blue-900 py-20 px-6 flex justify-center">
      <div className="max-w-6xl w-full text-center md:text-left flex flex-col md:flex-row items-center gap-16">

        {/* Texto */}
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-snug">
            Dashboard ideal para o <span className="text-yellow-400">seu negócio</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mt-6 max-w-xl">
            Um sistema completo e fácil de usar para você criar, editar e publicar seu cardápio digital em tempo real.
          </p>

          <div className="mt-10 space-y-4">
            {["Fácil de atualizar em tempo real", "Visual atrativo e responsivo", "Compatível com smartphones e tablets", "Sem necessidade de impressão"].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="text-yellow-400 w-6 h-6 mt-1" />
                <span className="text-white text-base mt-1">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico animado */}
        <div className="flex-1 w-full max-w-md mx-auto">
          <Card className="bg-white shadow-2xl rounded-2xl p-6 animate-fadeIn">
            <CardContent>
              <h3 className="text-xl font-bold text-blue-800 mb-4">Feedback positivo dos clientes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <XAxis dataKey="name" stroke="#1e40af" />
                  <YAxis stroke="#1e40af" />
                  <Tooltip />
                  <Bar dataKey="Gostaram" fill="#facc15" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
};

export default BusinessComponent;
