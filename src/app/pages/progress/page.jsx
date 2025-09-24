import { createClient } from "../../../../utils/supabase/server";
import ProgressDetailHeader from "@/app/_components/ProgressDetailHeader";
import BottomNavBar from "@/app/_components/BottomNavBar";
import WeightChart from "@/app/_components/WeightChart";

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <div className="p-4">No hay sesión activa.</div>;

  // Obtener todos los pesos
  const { data: pesos } = await supabase
    .from("peso_progreso")
    .select("fecha, peso")
    .eq("usuario_id", user.id)
    .order("fecha", { ascending: true });

  // Si no hay registros, obtener el peso del perfil
  let history = pesos ?? [];
  if (history.length === 0) {
    const { data: perfil } = await supabase
      .from("perfiles")
      .select("peso")
      .eq("id", user.id)
      .single();

    if (perfil?.peso) {
      history = [{ fecha: new Date().toISOString().split("T")[0], peso: perfil.peso }];
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20 items-center">
      <ProgressDetailHeader />
      <div className="w-full px-4 mt-6">
        <h2 className="md:text-center text-xl font-semibold text-gray-900 mb-4">
          Progreso de Peso
        </h2>

        <WeightChart history={history} />
      </div>
      <BottomNavBar active="Progreso" />
    </div>
  );
}
