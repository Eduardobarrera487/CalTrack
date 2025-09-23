"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../utils/supabase/client";
import BottomNavBar from "@/app/_components/BottomNavBar";
import HeadBar from "@/app/_components/HeadBar";
import CaloriesCard from "@/app/_components/CaloriesCard";
import ProgressCard from "@/app/_components/ProgressCard";
import WeightRegister from "@/app/_components/WeightRegister";

// Función fuera del componente


export default function CaloriesPage() {
  const [userId, setUserId] = useState(null);
  const [pesoActual, setPesoActual] = useState(0);
  const [pesoInicialMes, setPesoInicialMes] = useState(0);
  const [diferenciaMes, setDiferenciaMes] = useState(0);
  const [caloriasQuemadas, setCaloriasQuemadas] = useState(0);
  const [objetivo, setObjetivo] = useState("");
  const [cardData, setCardData] = useState(null);


  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUserId(user.id);

    const todayStr = new Date().toISOString().split("T")[0];
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const startDateStr = startOfMonth.toISOString().split("T")[0];

    // Comidas del día
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

    let consumidas = 0, proteinas = 0, carbohidratos = 0, grasas = 0;
    comidas?.forEach((comida) => {
      comida.comida_ingredientes?.forEach((ci) => {
        const i = ci.ingredientes;
        const cant = parseFloat(ci.cantidad || 0);
        const factor = cant / 100;
        consumidas += factor * (i?.calorias || 0);
        proteinas += factor * (i?.proteinas || 0);
        carbohidratos += factor * (i?.carbohidratos || 0);
        grasas += factor * (i?.grasas || 0);
      });
    });

    const { data: metas } = await supabase
      .from("metas_caloricas")
      .select("*")
      .eq("usuario_id", user.id)
      .single();

    setCardData({
      meta_calorias: metas?.calorias_objetivo ?? 2000,
      meta_proteinas: metas?.proteinas ?? 0,
      meta_carbohidratos: metas?.carbohidratos ?? 0,
      meta_grasas: metas?.grasas ?? 0,
      proteinas: Math.round(proteinas),
      carbohidratos: Math.round(carbohidratos),
      grasas: Math.round(grasas),
      consumidas: Math.round(consumidas),
    });


    // Obtener el último peso registrado
    const { data: pesos } = await supabase
      .from("peso_progreso")
      .select("*")
      .eq("usuario_id", user.id)
      .order("fecha", { ascending: false })
      .limit(1);

    let pesoActualValue = pesos?.[0]?.peso;

    if (pesoActualValue === undefined) {
      // Fallback: obtener peso del perfil si no hay pesos
      const { data: perfilPeso } = await supabase
        .from("perfiles")
        .select("peso")
        .eq("id", user.id)
        .single();

      pesoActualValue = perfilPeso?.peso ?? 0;
    }

    setPesoActual(pesoActualValue);

    // Obtener peso inicial del mes
    const { data: pesosInicioMes } = await supabase
      .from("peso_progreso")
      .select("*")
      .eq("usuario_id", user.id)
      .gte("fecha", startDateStr)
      .order("fecha", { ascending: true });

    const pesoInicialMesValue = pesosInicioMes?.[0]?.peso ?? pesoActualValue;

    setPesoInicialMes(pesoInicialMesValue);
    setDiferenciaMes(+(pesoInicialMesValue - pesoActualValue).toFixed(1));

    // Objetivo del usuario
    const { data: perfil } = await supabase
      .from("perfiles")
      .select("objetivo")
      .eq("id", user.id)
      .single();

    setObjetivo(perfil?.objetivo ?? "");

    // Calorías quemadas hoy
    const { data: entrenamientos } = await supabase
      .from("entrenamientos")
      .select("calorias_quemadas")
      .eq("usuario_id", user.id)
      .eq("fecha", todayStr);

    setCaloriasQuemadas(
      entrenamientos?.reduce((acc, e) => acc + (e.calorias_quemadas ?? 0), 0) || 0
    );
  };

  // Esta función actualiza el peso actual al registrar un nuevo peso
  const actualizarPeso = async (nuevoPeso, nuevaFecha) => {
    setPesoActual(nuevoPeso);

    if (!pesoInicialMes || nuevaFecha <= getFirstDayOfMonth()) {
      setPesoInicialMes(nuevoPeso);
      setDiferenciaMes(0);
      return;
    }

    setDiferenciaMes(+(pesoInicialMes - nuevoPeso).toFixed(1));
  };


  const getFirstDayOfMonth = () => {
    const dt = new Date();
    dt.setDate(1);
    return dt.toISOString().split("T")[0];
  };

  // Ejemplo de uso dentro del componente:
  // const { objetivo, pesoInicialMes } = getObjetivoYPesoInicial(objetivo, pesoInicialMes);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col pb-20 items-center">
      <div className="md:pl-30 ">
        <HeadBar />
      </div>


      <div className="md:pl-30 w-full max-w px-4 mt-6 space-y-6">
        {cardData && <CaloriesCard data={cardData} />}

        <ProgressCard
          pesoActual={pesoActual}
          objetivo={objetivo}
          diferenciaMes={diferenciaMes}
          caloriasQuemadas={Math.round(caloriasQuemadas)}
        />

        {userId && (
          <WeightRegister
            userId={userId}
            onPesoGuardado={(nuevoPeso, fecha) => actualizarPeso(nuevoPeso, fecha)}
          />
        )}
      </div>

      <BottomNavBar active="Home" />
    </div>
  );
}

// ...dentro o fuera del componente...



