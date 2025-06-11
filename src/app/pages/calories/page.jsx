"use client";

import BottomNavBar from "@/app/_components/BottomNavBar";
import HeadBar from "@/app/_components/HeadBar";
import ProgressCard from "@/app/_components/ProgressCard";
import CaloriesCard from "@/app/_components/CaloriesCard";

export default function CaloriesPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col pb-20 items-center">
      <HeadBar />

      <div className="w-full max-w-sm px-4 mt-6 space-y-6">
        <CaloriesCard />
        <ProgressCard />
      </div>

      <BottomNavBar active="Home" />
    </div>
  );
}
