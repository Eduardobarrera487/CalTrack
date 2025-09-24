"use client";
import React, { useState } from 'react';
import CustomInput from '@/app/_components/input';
import ComboBox from '@/app/_components/ComboBox';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../../utils/supabase/client';
import { useRegister } from '@/app/_context/RegisterContext';
import { OBJETIVO_OPTIONS } from '@/app/_constants/objectives';

const NewUser = () => {
    const { registerData, updateRegisterData } = useRegister();
    const [form, setForm] = useState({
        nombre: registerData.nombre || "",
        email: registerData.email || "",
        password: "",
        confirmPassword: "",
        peso: registerData.peso || "",
        altura: registerData.altura || "",
        edad: registerData.edad || "",
        objetivo: registerData.objetivo || "",
    });
    const [error, setError] = useState(null);
    const [emailError, setEmailError] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        updateRegisterData({ [e.target.name]: e.target.value });
        if (e.target.name === "email") {
            setEmailError(false);
        }
    };

    const handleObjetivoChange = (value) => {
        setForm({ ...form, objetivo: value });
        updateRegisterData({ objetivo: value });
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateEmail(form.email.trim())) {
            setEmailError(true);
            setError("Por favor ingrese un correo válido.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        const supabase = createClient();

        const { data, error: signUpError } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        const userId = data.user.id;
        const { error: profileError } = await supabase.from("perfiles").insert([
            {
                id: userId,
                nombre: form.nombre,
                edad: Number(form.edad),
                peso: Number(form.peso),
                altura: Number(form.altura),
                objetivo: form.objetivo,
                genero: null,
                actividad_fisica: null,
                preferencias: null,
                restricciones: null,
            },
        ]);

        if (profileError) {
            setError(profileError.message);
            setLoading(false);
            return;
        }

        setLoading(false);
        router.push("/pages/user-details");
    };

    return (
        <div className='flex flex-col items-center justify-center bg-white min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]'>
            <h1 className="text-2xl font-bold mb-4 text-black">Crea tu cuenta</h1>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 max-w-sm w-full">
                    <CustomInput
                        type="text"
                        placeholder="Nombre"
                        className="w-full"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                    />
                    <CustomInput
                        type="email"
                        placeholder="Email"
                        className={`w-full ${emailError ? "border-red-500" : ""}`}
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    {emailError && (
                        <span className="text-red-500 text-sm">Ingrese un correo válido</span>
                    )}
                    <CustomInput
                        type="password"
                        placeholder="Contraseña"
                        className="w-full"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <CustomInput
                        type="password"
                        placeholder="Confirmar contraseña"
                        className="w-full"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <CustomInput
                        type="text"
                        placeholder="Peso en LBS"
                        className="w-full"
                        name="peso"
                        value={form.peso}
                        onChange={handleChange}
                        required
                    />
                    <CustomInput
                        type="text"
                        placeholder="Altura en CM"
                        className="w-full"
                        name="altura"
                        value={form.altura}
                        onChange={handleChange}
                        required
                    />
                    <CustomInput
                        type="text"
                        placeholder="Edad"
                        className="w-full"
                        name="edad"
                        value={form.edad}
                        onChange={handleChange}
                        required
                    />
                    <ComboBox
                        options={OBJETIVO_OPTIONS}
                        value={form.objetivo}
                        onChange={handleObjetivoChange}
                        placeholder="Selecciona tu objetivo"
                        className="w-full"
                        label=""
                    />
                    {error && <div className="text-red-500 text-center">{error}</div>}
                    <button
                        type="submit"
                        className="w-full text-center p-2 bg-black text-white rounded-2xl hover:bg-gray-800 transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>
                </div>
            </form>
            <Link href="/pages/login" className="text-blue-500 hover:underline flex items-center gap-2 mt-4">
                <span>&larr;</span> Volver al inicio de sesión
            </Link>
        </div>
    );
};

export default NewUser;


// This code defines a simple React component for a new user registration page.
// It includes a form with an input field for the first name and styles it using Tailwind CSS classes.


