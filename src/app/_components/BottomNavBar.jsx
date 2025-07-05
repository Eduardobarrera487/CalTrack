"use client";

import Link from "next/link";
import { Home, Coffee, Dumbbell, User, Bot } from "lucide-react";

const tabs = [
  { name: "Home", href: "/pages/calories", icon: Home },
  { name: "Meals", href: "/pages/diary", icon: Coffee },
  { name: "Workouts", href: "/pages/workout", icon: Dumbbell },
  { name: "IA Chat", href: "/pages/aiChat", icon: Bot },
  { name: "Profile", href: "/pages/userConfig", icon: User },
];

export default function BottomNavBar({ active = "Home" }) {
  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 z-30">
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
  );
}
