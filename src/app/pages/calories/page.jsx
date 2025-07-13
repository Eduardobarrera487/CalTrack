import { createClient } from "../../../../utils/supabase/server";
import BottomNavBar from "@/app/_components/BottomNavBar";
import HeadBar from "@/app/_components/HeadBar";
import CaloriesCard from "@/app/_components/CaloriesCard";
import ProgressCard from "@/app/_components/ProgressCard";

export default async function CaloriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-4">No hay sesión activa.</div>;
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const startDateStr = startOfMonth.toISOString().split("T")[0];

  // Metas calóricas
  const { data: metas } = await supabase
    .from("metas_caloricas")
    .select("*")
    .eq("usuario_id", user.id)
    .single();

  // Comidas del día con ingredientes
  const { data: comidas } = await supabase
    .from("comidas")
    .select(`
      id,
      comida_ingredientes (
        cantidad,
        ingredientes (
          calorias,
          proteinas,
          carbohidratos,
          grasas
        )
      )
    `)
    .eq("usuario_id", user.id)
    .eq("fecha", todayStr);

  let consumidas = 0;
  let proteinas = 0;
  let carbohidratos = 0;
  let grasas = 0;

  if (comidas) {
    comidas.forEach((comida) => {
      comida.comida_ingredientes.forEach((ci) => {
        const i = ci.ingredientes;
        const cant = parseFloat(ci.cantidad || 0);
        consumidas += cant * (i.calorias || 0);
        proteinas += cant * (i.proteinas || 0);
        carbohidratos += cant * (i.carbohidratos || 0);
        grasas += cant * (i.grasas || 0);
      });
    });
  }

  // Progreso de peso
  const { data: pesos } = await supabase
    .from("peso_progreso")
    .select("*")
    .eq("usuario_id", user.id)
    .order("fecha", { ascending: false });

  const { data: pesosInicioMes } = await supabase
    .from("peso_progreso")
    .select("*")
    .eq("usuario_id", user.id)
    .gte("fecha", startDateStr)
    .order("fecha", { ascending: true });

  // Perfil para objetivo
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Calorías quemadas hoy
  const { data: entrenamientos } = await supabase
    .from("entrenamiento")
    .select("calorias_quemadas")
    .eq("usuario_id", user.id)
    .eq("fecha", todayStr);

  const pesoActual = pesos?.[0]?.peso ?? 0;
  const pesoInicialMes = pesosInicioMes?.[0]?.peso ?? pesoActual;
  const metaPeso = perfil?.objetivo?.includes("kg") ? parseFloat(perfil.objetivo) : null;
  const diferencia = (pesoInicialMes - pesoActual).toFixed(1);
  const caloriasQuemadas = entrenamientos?.reduce((acc, e) => acc + (e.calorias_quemadas ?? 0), 0);

  const cardData = {
    meta_calorias: metas?.calorias_objetivo ?? 2000,
    consumidas: Math.round(consumidas),
    proteinas: Math.round(proteinas),
    carbohidratos: Math.round(carbohidratos),
    grasas: Math.round(grasas),
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20 items-center">
      <HeadBar />

      <div className="w-full max-w-sm px-4 mt-6 space-y-6">
        <CaloriesCard data={cardData} />
        <ProgressCard
          pesoActual={pesoActual}
          metaPeso={metaPeso}
          diferenciaMes={diferencia}
          caloriasQuemadas={Math.round(caloriasQuemadas)}
        />
      </div>

      <BottomNavBar active="Home" />
    </div>
  );
}
