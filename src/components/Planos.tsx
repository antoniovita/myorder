import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Planos = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 px-4 py-10">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl">

        <Card className="flex flex-col h-120 justify-between p-6 border border-gray-200 shadow-md rounded-2xl bg-white">
          <CardContent className="space-y-5">
            <h2 className="text-3xl font-semibold text-gray-800">Plano Gratuito</h2>
            <p className="text-lg text-gray-500">Ideal para pequenos negócios que estão começando.</p>
            <ul className="text-lg text-gray-700 space-y-2">
              <li>✔️ Cadastro de até 10 produtos</li>
              <li>✔️ 1 usuário administrador</li>
              <li>✔️ Acesso ao painel básico</li>
              <li>❌ Relatórios avançados</li>
              <li>❌ Suporte prioritário</li>
            </ul>
            <div className="pt-2">
              <p className="text-4xl font-extrabold text-black">R$ 0,00</p>
            </div>
          </CardContent>
          <Button variant="outline" className="mt-6 w-full hover:cursor-pointer">
            Começar grátis
          </Button>
        </Card>

        <Card className="flex flex-col justify-between p-6 border-2 border-blue-600 shadow-xl rounded-2xl bg-white scale-[1.02]">
          <CardContent className="space-y-5">
            <h2 className="text-3xl font-semibold text-gray-800">Plano Premium</h2>
            <p className="text-lg text-gray-500">Para quem busca controle total e suporte profissional.</p>
            <ul className="text-lg text-gray-700 space-y-2">
              <li>✔️ Produtos ilimitados</li>
              <li>✔️ Vários usuários com permissões</li>
              <li>✔️ Relatórios detalhados</li>
              <li>✔️ Suporte prioritário</li>
              <li>✔️ Atualizações exclusivas</li>
            </ul>
            <div className="pt-2">
              <p className="text-4xl font-extrabold text-black">R$ 49,90/mês</p>
            </div>
          </CardContent>
          <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white">
            Assinar agora
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Planos;
