"use client";
import { useState, useEffect } from "react";
import ReverseArrowButton from "@/app/_components/ReverseArrowButton";
import Sidebar from "@/app/_components/Sidebar";
import CustomButton from "@/app/_components/button";
import CustomInput from "@/app/_components/input";
import BottomNavBar from "@/app/_components/BottomNavBar";
import LogoutBtn from "@/app/_components/logoutBtn";
import { createClient } from "../../../../utils/supabase/client";

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
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        setMessageUsuario({ type: "error", text: "Error al obtener usuario." });
        return;
      }

      if (user) {
        setEmail(user.email ?? "");
        // Obtener perfil
        const { data: perfil, error: perfilError } = await supabase
          .from("perfiles")
          .select(
            "nombre, edad, peso, altura, genero, objetivo, actividad_fisica, preferencias, restricciones"
          )
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

        // Preferencias y restricciones pueden venir como array o JSON string, aseguremos que sean arrays
        const prefs =
          typeof perfil.preferencias === "string"
            ? JSON.parse(perfil.preferencias)
            : perfil.preferencias || [];
        const restr =
          typeof perfil.restricciones === "string"
            ? JSON.parse(perfil.restricciones)
            : perfil.restricciones || [];

        setPreferencias(prefs);
        setRestricciones(restr);
      }
    };

    fetchUserAndProfile();
  }, [supabase]);

  // Manejar checkboxes preferencias
  const togglePreferencia = (val) => {
    setPreferencias((prev) =>
      prev.includes(val) ? prev.filter((p) => p !== val) : [...prev, val]
    );
  };

  // Manejar checkboxes restricciones
  const toggleRestriccion = (val) => {
    setRestricciones((prev) =>
      prev.includes(val) ? prev.filter((r) => r !== val) : [...prev, val]
    );
  };

  // Actualizar usuario (email, password, nombre)
  const handleSubmitUsuario = async (e) => {
    e.preventDefault();
    setLoadingUsuario(true);
    setMessageUsuario(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

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

    // Actualizar email (opcional)
    if (email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email,
      });

      if (emailError) {
        setMessageUsuario({ type: "error", text: `Error al actualizar correo: ${emailError.message}` });
        setLoadingUsuario(false);
        return;
      } else {
        setMessageUsuario({
          type: "info",
          text: "Se ha enviado un correo para confirmar el cambio de email. Por favor revisa tu correo.",
        });
      }
    }

    // Actualizar contraseña (si está relleno)
    if (password.trim().length > 0) {
      const { error: passError } = await supabase.auth.updateUser({
        password,
      });

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

    // Actualizar nombre en tabla perfiles
    const { error: perfilError } = await supabase
      .from("perfiles")
      .upsert({ id: user.id, nombre: name }, { onConflict: "id" });

    if (perfilError) {
      setMessageUsuario({ type: "error", text: "Error al actualizar nombre." });
      setLoadingUsuario(false);
      return;
    }

    setPassword(""); // Limpiar contraseña
    setLoadingUsuario(false);
  };

  // Actualizar perfil (edad, peso, altura, genero, objetivo, actividad, preferencias, restricciones)
  const handleSubmitPerfil = async (e) => {
    e.preventDefault();
    setLoadingPerfil(true);
    setMessagePerfil(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessagePerfil({ type: "error", text: "Usuario no autenticado." });
      setLoadingPerfil(false);
      return;
    }

   

    // En la actualización del perfil:
    const perfilData = {
      id: user.id,
      edad: edad ? Number(edad) : null,
      peso: peso ? Number(peso) : null,
      altura: altura ? Number(altura) : null,
      genero,
      objetivo,
      actividad_fisica: actividadFisica,
      preferencias,  // directamente array
      restricciones, // directamente array
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
    <div className="flex flex-col bg-white min-h-screen p-2 pt-8 gap-3 font-[family-name:var(--font-geist-sans)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <header className="flex flex-row gap-5 items-center mb-4 border-b border-gray-300 shadow-lg shadow-gray-200">
        <ReverseArrowButton string="/pages/calories" />
        <nav className="flex items-center gap-3">
          <h1 className="text-[1rem] font-bold text-start mb-4 text-black ">
            Configuración de usuario
          </h1>
        </nav>
      </header>

      <main className="flex-1 overflow-y-auto p-4 max-w-md mx-auto">
        {/* Formulario para usuario */}
        <section className="bg-gray-50 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Datos de Usuario</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmitUsuario}>
            <div>
              <label className="block text-gray-700 text-sm mb-1" htmlFor="name">
                Nombre
              </label>
              <CustomInput
                id="name"
                type="text"
                placeholder="Tu nombre"
                className="w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1" htmlFor="email">
                Correo electrónico
              </label>
              <CustomInput
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1" htmlFor="password">
                Nueva contraseña
              </label>
              <CustomInput
                id="password"
                type="password"
                placeholder="Nueva contraseña"
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {messageUsuario && (
              <p
                className={`text-sm ${messageUsuario.type === "error"
                    ? "text-red-600"
                    : messageUsuario.type === "info"
                      ? "text-blue-600"
                      : "text-green-600"
                  }`}
              >
                {messageUsuario.text}
              </p>
            )}

            <CustomButton
              type="submit"
              className="w-full text-white"
              text={loadingUsuario ? "Guardando..." : "Guardar Cambios"}
              disabled={loadingUsuario}
            />
          </form>
        </section>

        {/* Formulario para perfil */}
        <section className="bg-gray-50 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Perfil</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmitPerfil}>
            <div>
              <label className="block text-gray-700 text-sm mb-1" htmlFor="edad">
                Edad
              </label>
              <CustomInput
                id="edad"
                type="number"
                placeholder="Edad"
                className="w-full"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                min={0}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1" htmlFor="peso">
                Peso (kg)
              </label>
              <CustomInput
                id="peso"
                type="number"
                placeholder="Peso en kg"
                className="w-full"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                min={0}
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1" htmlFor="altura">
                Altura (cm)
              </label>
              <CustomInput
                id="altura"
                type="number"
                placeholder="Altura en cm"
                className="w-full"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                min={0}
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1" htmlFor="genero">
                Género
              </label>
              <CustomInput
                id="genero"
                type="text"
                placeholder="Género"
                className="w-full"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1" htmlFor="objetivo">
                Objetivo
              </label>
              <CustomInput
                id="objetivo"
                type="text"
                placeholder="Objetivo"
                className="w-full"
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1" htmlFor="actividadFisica">
                Actividad Física
              </label>
              <select
                id="actividadFisica"
                className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                value={actividadFisica}
                onChange={(e) => setActividadFisica(e.target.value)}
              >
                <option value="sedentario">Sedentario</option>
                <option value="ligero">Ligero</option>
                <option value="moderado">Moderado</option>
                <option value="intenso">Intenso</option>
              </select>
            </div>

            {/* Preferencias */}
            <fieldset className="border p-3 rounded-md">
              <legend className="font-semibold mb-2 text-gray-700">Preferencias</legend>
              {preferenciasOpciones.map((opcion) => (
                <label key={opcion} className="inline-flex items-center mr-4 text-gray-700">
                  <input
                    type="checkbox"
                    checked={preferencias.includes(opcion)}
                    onChange={() => togglePreferencia(opcion)}
                    className="mr-1 text-gray-700"
                  />
                  {opcion}
                </label>
              ))}
            </fieldset>

            {/* Restricciones */}
            <fieldset className="border p-3 rounded-md mt-4">
              <legend className="font-semibold mb-2 text-gray-700">Restricciones</legend>
              {restriccionesOpciones.map((opcion) => (
                <label key={opcion} className="inline-flex items-center mr-4 text-gray-700">
                  <input
                    type="checkbox"
                    checked={restricciones.includes(opcion)}
                    onChange={() => toggleRestriccion(opcion)}
                    className="mr-1"
                  />
                  {opcion}
                </label>
              ))}
            </fieldset>

            {messagePerfil && (
              <p
                className={`text-sm mt-3 ${messagePerfil.type === "error"
                    ? "text-red-600"
                    : "text-green-600"
                  }`}
              >
                {messagePerfil.text}
              </p>
            )}

            <CustomButton
              type="submit"
              className="w-full mt-4 text-white"
              text={loadingPerfil ? "Guardando..." : "Guardar Cambios Perfil"}
              disabled={loadingPerfil}
            />
          </form>
        </section>

        <section className="pb-12">
          <LogoutBtn />
        </section>
      </main>
      <BottomNavBar active="Profile" />
    </div>
  );
}
