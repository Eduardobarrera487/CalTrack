"use client";

import Link from "next/link";
import { Home, Coffee, Dumbbell, User, Bot } from "lucide-react";

const tabs = [
  { name: "Inicio", href: "/pages/calories", icon: Home },
  { name: "Comidas", href: "/pages/diary", icon: Coffee },
  { name: "Ejercicios", href: "/pages/workout", icon: Dumbbell },
  { name: "Chat IA", href: "/pages/aiChat", icon: Bot },
  { name: "Perfil", href: "/pages/userConfig", icon: User },
];

export default function BottomNavBar({ active = "Inicio" }) {
  return (
    <>
      {/* Navbar horizontal para móviles */}
      <nav className="fixed bottom-0 w-full md:hidden bg-white border-t border-gray-200 z-30">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.name;
            const color = isActive ? "text-blue-900" : "text-gray-400";
            const font = isActive ? "font-medium" : "font-normal";

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex flex-col items-center space-y-1 ${color} ${font}`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sidebar vertical para PC */}
      <nav className="hidden md:fixed md:left-0 md:top-0 md:h-full md:w-20 md:flex md:flex-col md:items-center md:py-4 md:bg-white md:border-r md:border-gray-200 z-30">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.name;
          const color = isActive ? "text-blue-900" : "text-gray-400";
          const font = isActive ? "font-medium" : "font-normal";

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center my-4 ${color} ${font}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
