"use client";

import ProgressDetailHeader from "@/app/_components/ProgressDetailHeader";
import WeightChart from "@/app/_components/WeightChart";
import WeightStats from "@/app/_components/WeightStats";
import WeightHistory from "@/app/_components/WeightHistory";
import BottomNavBar from "@/app/_components/BottomNavBar";

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col pb-20 items-center">
      <ProgressDetailHeader />
      <div className="w-full flex flex-col items-center mt-6 gap-6">
        <WeightChart />
        <WeightStats />
        <WeightHistory />
      </div>
      <BottomNavBar active="Home" />
    </div>
  );
}
