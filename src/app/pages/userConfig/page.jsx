"use client";
import { useState, useEffect } from "react";
import ReverseArrowButton from "@/app/_components/ReverseArrowButton";
import Sidebar from "@/app/_components/Sidebar";
import CustomButton from "@/app/_components/button";
import CustomInput from "@/app/_components/input";
import ComboBox from "@/app/_components/ComboBox";
import BottomNavBar from "@/app/_components/BottomNavBar";
import LogoutBtn from "@/app/_components/logoutBtn";
import { createClient } from "../../../../utils/supabase/client";
import { OBJETIVO_OPTIONS } from "@/app/_constants/objectives";

export default function UserConfig() {
  const supabase = createClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Usuario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Perfil
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [genero, setGenero] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [actividadFisica, setActividadFisica] = useState("sedentario");

  // Preferencias (checkboxes)
  const preferenciasOpciones = ["Vegetariano", "Vegano", "Pescetariano"];
  const [preferencias, setPreferencias] = useState([]);

  // Restricciones (checkboxes)
  const restriccionesOpciones = ["gluten-free", "lactose-free", "nut-free"];
  const [restricciones, setRestricciones] = useState([]);

  // Mensajes y loading
  const [loadingUsuario, setLoadingUsuario] = useState(false);
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const [messageUsuario, setMessageUsuario] = useState(null);
  const [messagePerfil, setMessagePerfil] = useState(null);

  // Cargar datos actuales del usuario y perfil
  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        setMessageUsuario({ type: "error", text: "Error al obtener usuario." });
        return;
      }
      if (user) {
        setEmail(user.email ?? "");
        const { data: perfil, error: perfilError } = await supabase
          .from("perfiles")
          .select("nombre, edad, peso, altura, genero, objetivo, actividad_fisica, preferencias, restricciones")
          .eq("id", user.id)
          .single();

        if (perfilError) {
          setMessagePerfil({ type: "error", text: "Error al cargar perfil." });
          return;
        }

        setName(perfil.nombre || "");
        setEdad(perfil.edad ?? "");
        setPeso(perfil.peso ?? "");
        setAltura(perfil.altura ?? "");
        setGenero(perfil.genero || "");
        setObjetivo(perfil.objetivo || "");
        setActividadFisica(perfil.actividad_fisica || "sedentario");

        const prefs = typeof perfil.preferencias === "string"
          ? JSON.parse(perfil.preferencias)
          : perfil.preferencias || [];
        const restr = typeof perfil.restricciones === "string"
          ? JSON.parse(perfil.restricciones)
          : perfil.restricciones || [];
        setPreferencias(prefs);
        setRestricciones(restr);
      }
    };
    fetchUserAndProfile();
  }, [supabase]);

  const togglePreferencia = (val) => {
    setPreferencias((prev) =>
      prev.includes(val) ? prev.filter((p) => p !== val) : [...prev, val]
    );
  };

  const toggleRestriccion = (val) => {
    setRestricciones((prev) =>
      prev.includes(val) ? prev.filter((r) => r !== val) : [...prev, val]
    );
  };

  const handleSubmitUsuario = async (e) => {
    e.preventDefault();
    setLoadingUsuario(true);
    setMessageUsuario(null);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setMessageUsuario({ type: "error", text: "Usuario no autenticado." });
      setLoadingUsuario(false);
      return;
    } else {
      setMessageUsuario({
        type: "info",
        text: "Se ha actualizado el usuario correctamente.",
      });
    }

    if (email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email });
      if (emailError) {
        setMessageUsuario({ type: "error", text: `Error al actualizar correo: ${emailError.message}` });
        setLoadingUsuario(false);
        return;
      } else {
        setMessageUsuario({
          type: "info",
          text: "Se ha enviado un correo para confirmar el cambio de email. Revisa tu correo.",
        });
      }
    }

    if (password.trim().length > 0) {
      const { error: passError } = await supabase.auth.updateUser({ password });
      if (passError) {
        setMessageUsuario({ type: "error", text: `Error al actualizar contraseña: ${passError.message}` });
        setLoadingUsuario(false);
        return;
      } else {
        setMessageUsuario({
          type: "info",
          text: "Se ha actualizado la contraseña correctamente.",
        });
      }
    }

    const { error: perfilError } = await supabase
      .from("perfiles")
      .upsert({ id: user.id, nombre: name }, { onConflict: "id" });

    if (perfilError) {
      setMessageUsuario({ type: "error", text: "Error al actualizar nombre." });
      setLoadingUsuario(false);
      return;
    }

    setPassword("");
    setLoadingUsuario(false);
  };

  const handleSubmitPerfil = async (e) => {
    e.preventDefault();
    setLoadingPerfil(true);
    setMessagePerfil(null);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setMessagePerfil({ type: "error", text: "Usuario no autenticado." });
      setLoadingPerfil(false);
      return;
    }

    const perfilData = {
      id: user.id,
      edad: edad ? Number(edad) : null,
      peso: peso ? Number(peso) : null,
      altura: altura ? Number(altura) : null,
      genero,
      objetivo,
      actividad_fisica: actividadFisica,
      preferencias,
      restricciones,
    };

    const { error: perfilError } = await supabase
      .from("perfiles")
      .upsert(perfilData, { onConflict: "id" });

    if (perfilError) {
      setMessagePerfil({ type: "error", text: "Error al actualizar perfil." });
      setLoadingPerfil(false);
      return;
    }

    setMessagePerfil({ type: "success", text: "Perfil actualizado correctamente." });
    setLoadingPerfil(false);
  };

  return (
    <>
      <div className="md:px-30 px-3 flex flex-col bg-white min-h-screen font-[family-name:var(--font-geist-sans)]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <header className="flex flex-row gap-5 items-center p-4 border-b border-gray-300 shadow-lg shadow-gray-200 mt-5">
          <ReverseArrowButton string="/pages/calories" />
          <h1 className="text-lg font-bold text-black">Configuración de usuario</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Usuario */}
          <section className="bg-gray-50 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Datos de Usuario</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmitUsuario}>
              <CustomInput id="name" type="text" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required />
              <CustomInput id="email" type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <CustomInput id="password" type="password" placeholder="Nueva contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
              {messageUsuario && <p className={`text-sm ${messageUsuario.type === "error" ? "text-red-600" : messageUsuario.type === "info" ? "text-blue-600" : "text-green-600"}`}>{messageUsuario.text}</p>}
              <CustomButton type="submit" className="w-full text-white" text={loadingUsuario ? "Guardando..." : "Guardar Cambios"} disabled={loadingUsuario} />
            </form>
          </section>

          {/* Perfil */}
          <section className="bg-gray-50 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Perfil</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmitPerfil}>
              <CustomInput id="edad" type="number" placeholder="Edad" value={edad} onChange={(e) => setEdad(e.target.value)} min={0} />
              <CustomInput id="peso" type="number" placeholder="Peso en kg" value={peso} onChange={(e) => setPeso(e.target.value)} min={0} step="0.1" />
              <CustomInput id="altura" type="number" placeholder="Altura en cm" value={altura} onChange={(e) => setAltura(e.target.value)} min={0} step="0.1" />
              <CustomInput id="genero" type="text" placeholder="Género" value={genero} onChange={(e) => setGenero(e.target.value)} />
              <ComboBox id="objetivo" label="Objetivo" options={OBJETIVO_OPTIONS} value={objetivo} onChange={(value) => setObjetivo(value)} placeholder="Selecciona tu objetivo" />
              <select id="actividadFisica" className="border border-gray-300 rounded-md p-2 text-gray-700" value={actividadFisica} onChange={(e) => setActividadFisica(e.target.value)}>
                <option value="sedentario">Sedentario</option>
                <option value="ligero">Ligero</option>
                <option value="moderado">Moderado</option>
                <option value="intenso">Intenso</option>
              </select>

              {/* Preferencias */}
              <fieldset className="border p-3 rounded-md">
                <legend className="font-semibold mb-2 text-gray-700">Preferencias</legend>
                {preferenciasOpciones.map((opcion) => (
                  <label key={opcion} className="inline-flex items-center mr-4 text-gray-700">
                    <input type="checkbox" checked={preferencias.includes(opcion)} onChange={() => togglePreferencia(opcion)} className="mr-1" />
                    {opcion}
                  </label>
                ))}
              </fieldset>

              {/* Restricciones */}
              <fieldset className="border p-3 rounded-md mt-4">
                <legend className="font-semibold mb-2 text-gray-700">Restricciones</legend>
                {restriccionesOpciones.map((opcion) => (
                  <label key={opcion} className="inline-flex items-center mr-4 text-gray-700">
                    <input type="checkbox" checked={restricciones.includes(opcion)} onChange={() => toggleRestriccion(opcion)} className="mr-1" />
                    {opcion}
                  </label>
                ))}
              </fieldset>

              {messagePerfil && <p className={`text-sm mt-3 ${messagePerfil.type === "error" ? "text-red-600" : "text-green-600"}`}>{messagePerfil.text}</p>}

              <CustomButton type="submit" className="w-full mt-4 text-white" text={loadingPerfil ? "Guardando..." : "Guardar Cambios Perfil"} disabled={loadingPerfil} />
            </form>
          </section>

          {/* Logout */}
          <section className="col-span-full mb-25">
            <LogoutBtn />
          </section>
        </main>


      </div>
      <BottomNavBar active="Profile" />

    </>
  );
}
