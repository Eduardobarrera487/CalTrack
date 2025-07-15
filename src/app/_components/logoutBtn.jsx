"use client";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import { useRegister } from "@/app/_context/RegisterContext";

export default function LogoutBtn() {
  const router = useRouter();
  const { updateRegisterData } = useRegister();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    updateRegisterData({
      nombre: "",
      email: "",
      password: "",
      peso: "",
      altura: "",
      edad: "",
      objetivo: "",
      genero: "",
      actividad_fisica: "",
      preferencias: [],
      restricciones: [],
    });
    router.push("/pages/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full py-3 mt-4 bg-red-500 text-white rounded-xl font-semibold text-base shadow-md active:bg-red-700 transition-colors "
      style={{
        letterSpacing: "0.02em",
        boxShadow: "0 2px 8px rgba(220,38,38,0.08)",
      }}
    >
      Cerrar sesión
    </button>
  );
}