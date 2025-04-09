"use client";

import { useState } from "react";
import {
  UserRound,
  CreditCard,
  Lock,
  Cookie,
  ShieldCheck,
} from "lucide-react";
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
    { label: "Perfil", key: "perfil", icon: <UserRound size={20} /> },
    {
      label: "Cartões / Contas Bancárias",
      key: "banco",
      icon: <CreditCard size={20} />,
    },
    { label: "Trocar Senha", key: "senha", icon: <Lock size={20} /> },
    {
      label: "Preferências de Cookies",
      key: "cookies",
      icon: <Cookie size={20} />,
      disabled: true,
    },
    {
      label: "Configurações de Privacidade",
      key: "privacidade",
      icon: <ShieldCheck size={20} />,
      disabled: true,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">

      <aside className="w-16 md:w-72 md:py-25 bg-white border-r p-4 md:p-6 shadow-sm py-20 transition-all duration-300 flex flex-col items-center md:items-start">
        <div className="space-y-1 w-full">

          <div className="text-xs uppercase text-gray-400 font-semibold mb-4 tracking-wider hidden md:block">
            Minha Conta
          </div>

          <ul className="space-y-2 w-full">
            {menuItems.map((item) => (
              <li
                key={item.key}
                onClick={() => !item.disabled && setActiveTab(item.key)}
                className={`flex items-center md:justify-start justify-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition
                  ${
                    activeTab === item.key
                      ? "bg-orange-100 text-orange-600"
                      : "hover:bg-gray-100"
                  } 
                  ${item.disabled ? "text-gray-400 cursor-not-allowed" : ""}
                `}
              >
                <div>{item.icon}</div>

                <span className="hidden md:inline text-sm">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>


      <main className="py-20 px-8 flex-1">{renderContent()}</main>
    </div>
  );
};

export default AccountPage;
