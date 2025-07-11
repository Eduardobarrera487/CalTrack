"use client";
import React, { createContext, useContext, useState } from "react";
import { createClient } from "../../../utils/supabase/client";

const RegisterContext = createContext();

export function RegisterProvider({ children }) {
  const [registerData, setRegisterData] = useState({
    // Datos iniciales del registro
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

  // Función para actualizar cualquier campo
  const updateRegisterData = (fields) => {
    setRegisterData((prev) => ({ ...prev, ...fields }));
  };

  // Obtiene los datos del perfil desde Supabase y los guarda en registerData
  const fetchRegisterData = async () => {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return null;

    const { data, error } = await supabase
      .from("perfiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setRegisterData((prev) => ({
        ...prev,
        ...data,
        email: user.email || prev.email,
      }));
      return data;
    }
    return null;
  };

  return (
    <RegisterContext.Provider
      value={{ registerData, updateRegisterData, fetchRegisterData }}
    >
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {
  return useContext(RegisterContext);
}