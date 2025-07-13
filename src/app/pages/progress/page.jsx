import { createClient } from "../../../../utils/supabase/server";
import ProgressDetailHeader from "@/app/_components/ProgressDetailHeader";
import BottomNavBar from "@/app/_components/BottomNavBar";
import WeightChart from "@/app/_components/WeightChart";

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-4">No hay sesión activa.</div>;
  }

  const { data: pesos } = await supabase
    .from("peso_progreso")
    .select("fecha, peso")
    .eq("usuario_id", user.id)
    .order("fecha", { ascending: true });

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20 items-center">
      <ProgressDetailHeader />
      <div className="w-full max-w-md px-4 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Weight Progress</h2>
        <WeightChart history={pesos ?? []} />
      </div>
      <BottomNavBar active="Progress" />
    </div>
  );
}
