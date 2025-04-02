import Image from "next/image";

export default function Home() {
  return ( 
  
  <div className="h-screen justify-center items-center">
      <div className="border rounded-2xl gap-3 bg-gray-200 flex flex-col">
        <h1> Bem vindo! </h1>
        <div>
          <label htmlFor="">Nome</label>
          <input type="text" />
        </div>

      </div>
    
  </div> );

}
