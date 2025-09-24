'use client'
import { useState } from "react";
import CustomInput from "@/app/_components/input";
import Logo from "@/app/_components/caltrackLogo";
import CustomButton from "@/app/_components/button";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { createClient } from "../../../../utils/supabase/client";
import { useRegister } from "@/app/_context/RegisterContext";

export default function Login() {
    const router = useRouter();
    const { updateRegisterData } = useRegister();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
        });
        if (error) {
            setError("Credenciales incorrectas o usuario no existe.");
            setLoading(false);
            return;
        }
        // Obtener datos de perfil
        const { data: perfil } = await supabase
            .from("perfiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

        updateRegisterData({
            email: data.user.email,
            nombre: perfil?.nombre || "",
            peso: perfil?.peso || "",
            altura: perfil?.altura || "",
            edad: perfil?.edad || "",
            objetivo: perfil?.objetivo || "",
            genero: perfil?.genero || "",
            actividad_fisica: perfil?.actividad_fisica || "",
            preferencias: perfil?.preferencias || [],
            restricciones: perfil?.restricciones || [],
        });

        setLoading(false);
        router.push('/pages/calories');
    };

    return (
        <div className="flex flex-col items-center justify-center bg-white min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
            <Logo />
            <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleLogin}>
                <CustomInput
                    type="email"
                    name="email"
                    placeholder="Nombre de usuario/email"
                    className="w-full"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <CustomInput
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    className="w-full"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                {error && <div className="text-red-500 text-center">{error}</div>}
                <CustomButton className="w-full" text={loading ? "Ingresando..." : "Ingresar"} type="submit" disabled={loading} />
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <Link href="/pages/forgot-password" className="hover:underline">
                        ¿Olvidó su contraseña?
                    </Link>
                    <Link href="/pages/new-user" className="hover:underline hover:text-blue-500">
                        Registrarse
                    </Link>
                </div>
            </form>
        </div>
    );
}