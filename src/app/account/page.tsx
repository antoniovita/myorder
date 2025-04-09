"use client";

import { useState } from "react";
import { UserRound, CreditCard, Lock, Settings2, Cookie, ShieldCheck } from "lucide-react";
import ProfileForm from "@/components/ProfileForm";
import ChangePassword from "@/components/ChangePassword";
import PaymentInfo from "@/components/PaymentInfo";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("perfil");

  const renderContent = () => {
    switch (activeTab) {
      case "perfil":
        return <ProfileForm />;
      case "banco":
        return <PaymentInfo />;
      case "senha":
        return <ChangePassword />;
      default:
        return <ProfileForm />;
    }
  };

  const menuItems = [
    { label: "Perfil", key: "perfil", icon: <UserRound size={16} /> },
    { label: "Cartões / Contas Bancárias", key: "banco", icon: <CreditCard size={16} /> },
    { label: "Trocar Senha", key: "senha", icon: <Lock size={16} /> },
    { label: "Preferências de Cookies", key: "cookies", icon: <Cookie size={16} />, disabled: true },
    { label: "Configurações de Privacidade", key: "privacidade", icon: <ShieldCheck size={16} />, disabled: true },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-orange-500 p-3 rounded-full flex items-center justify-center">
            <UserRound size={20} color="white" />
          </div>
          <h1 className="text-lg font-semibold">@carlosdasilva</h1>
        </div>

        <div className="space-y-1">
          <div className="text-xs uppercase text-gray-400 font-semibold mb-2 tracking-wider">
            Minha Conta
          </div>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li
                key={item.key}
                onClick={() => !item.disabled && setActiveTab(item.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition 
                  ${
                    activeTab === item.key
                      ? "bg-orange-100 text-orange-600 font-semibold"
                      : "hover:bg-gray-100"
                  } 
                  ${item.disabled ? "text-gray-400 cursor-not-allowed" : ""}
                `}
              >
                {item.icon}
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white shadow-inner rounded-sm">
        {renderContent()}
      </main>
    </div>
  );
};

export default AccountPage;
