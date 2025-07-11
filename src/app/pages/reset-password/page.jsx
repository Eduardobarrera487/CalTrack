"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomInput from "@/app/_components/input";
import CustomButton from "@/app/_components/button";
import CaltrackLogo from "@/app/_components/caltrackLogo";
import { createClient } from "../../../../utils/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError("No se pudo actualizar la contraseña.");
    } else {
      setMessage("¡Contraseña actualizada! Ahora puedes iniciar sesión.");
      setTimeout(() => router.push("/pages/login"), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md flex flex-col items-center mb-8">
        <CaltrackLogo className="mx-auto" />
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Restablecer contraseña</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CustomInput
            label="Nueva contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Nueva contraseña"
          />
          <CustomInput
            label="Confirmar contraseña"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            placeholder="Confirmar contraseña"
          />
          <button
            type="submit"
            className="p-2 bg-black text-white rounded-2xl hover:bg-gray-800 transition-colors w-full"
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
          {error && <div className="text-red-500 text-center">{error}</div>}
          {message && <div className="text-green-600 text-center">{message}</div>}
        </form>
      </div>
    </div>
  );
}