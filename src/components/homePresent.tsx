import Link from "next/link";

const HomePresent = () => {
  return (
    <div className="flex flex-col gap-4 max-w-md p-4 text-center sm:text-left">
      <h1 className="text-3xl font-bold text-gray-800">Crie um Cardápio Digital</h1>
      <p className="text-gray-600 text-lg">
        Transforme a experiência dos seus clientes com um cardápio digital interativo e fácil de usar. Modernize seu
        negócio agora!
      </p>
      <Link
        className="bg-yellow-400 w-[50%] text-gray-900 text-center font-semibold py-2 px-6 rounded-xl hover:bg-yellow-500 transition"
        href=""
      >
        Crie agora
      </Link>
    </div>
  );
};

export default HomePresent;