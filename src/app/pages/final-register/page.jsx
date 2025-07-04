"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from '@/app/_components/caltrackLogo';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../../utils/supabase/client';

function calcularMacros({ peso, altura, edad, genero, actividad_fisica, objetivo }) {
    // Peso en kg, altura en cm
    const pesoKg = Number(peso);
    const alturaCm = Number(altura);
    const edadNum = Number(edad);

    // Fórmula de Harris-Benedict
    let tmb = 0;
    if (genero === "Masculino") {
        tmb = 88.36 + (13.4 * pesoKg) + (4.8 * alturaCm) - (5.7 * edadNum);
    } else {
        tmb = 447.6 + (9.2 * pesoKg) + (3.1 * alturaCm) - (4.3 * edadNum);
    }

    // Factor de actividad
    let factor = 1.2;
    if (actividad_fisica === "ligero") factor = 1.375;
    else if (actividad_fisica === "moderado") factor = 1.55;
    else if (actividad_fisica === "intenso") factor = 1.725;

    let calorias = tmb * factor;

    // Ajuste por objetivo
    let objetivoMacros = { p: 0.3, c: 0.4, g: 0.3 }; // default: 30% protes, 40% carbs, 30% grasas
    if (objetivo && objetivo.toLowerCase().includes("perder")) {
        calorias -= 400;
        objetivoMacros = { p: 0.35, c: 0.35, g: 0.3 }; // más proteína, menos carbos
    } else if (objetivo && objetivo.toLowerCase().includes("ganar")) {
        calorias += 400;
        objetivoMacros = { p: 0.25, c: 0.5, g: 0.25 }; // más carbos, menos grasas
    }

    calorias = Math.round(calorias);

    // Macronutrientes en gramos
    const proteinas = Math.round((calorias * objetivoMacros.p) / 4);
    const carbohidratos = Math.round((calorias * objetivoMacros.c) / 4);
    const grasas = Math.round((calorias * objetivoMacros.g) / 9);

    return {
        calorias,
        proteinas,
        carbohidratos,
        grasas,
    };
}

const FinalRegisterPage = () => {
    const [perfil, setPerfil] = useState(null);
    const [macros, setMacros] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPerfil = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError("No autenticado");
                return;
            }
            const { data, error } = await supabase.from("perfiles").select("*").eq("id", user.id).single();
            if (error) {
                setError(error.message);
                return;
            }
            setPerfil(data);
            setMacros(calcularMacros(data));
        };
        fetchPerfil();
    }, []);

    const handleContinue = async () => {
        if (!perfil || !macros) return;
        setLoading(true);
        setError(null);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setError("No autenticado");
            setLoading(false);
            return;
        }

        // Insertar metas_caloricas (upsert por si ya existe)
        const { error: metaError } = await supabase.from("metas_caloricas").upsert([{
            usuario_id: user.id,
            calorias_objetivo: macros.calorias,
            proteinas: macros.proteinas,
            carbohidratos: macros.carbohidratos,
            grasas: macros.grasas,
        }]);

        if (metaError) {
            setError(metaError.message);
            setLoading(false);
            return;
        }

        // Insertar peso_progreso
        const { error: pesoError } = await supabase.from("peso_progreso").insert([{
            usuario_id: user.id,
            peso: perfil.peso,
        }]);

        if (pesoError) {
            setError(pesoError.message);
            setLoading(false);
            return;
        }

        setLoading(false);
        router.push("/pages/calories"); // Cambia la ruta si es necesario
    };

    return (
        <div className="flex flex-col items-center justify-center bg-white min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
            {/* Flecha para regresar */}
            <Link href="/pages/user-details" className="absolute top-4 left-4">
                <img
                    src="/path/to/arrow-icon.png"
                    alt="Regresar"
                    className="w-6 h-6"
                />
            </Link>

            {/* Ícono */}
            <Logo />

            {/* Texto */}
            <p className="text-center text-black text-lg font-medium">
                Tu consumo diario de calorías debe ser de:
                <br />
                <span className="font-bold">
                    {macros ? `${macros.calorias} kcal!` : "Calculando..."}
                </span>
            </p>
            {macros && (
                <div className="text-black text-center">
                    <div>Proteínas: <b>{macros.proteinas}g</b></div>
                    <div>Carbohidratos: <b>{macros.carbohidratos}g</b></div>
                    <div>Grasas: <b>{macros.grasas}g</b></div>
                </div>
            )}
            {error && <div className="text-red-500 text-center">{error}</div>}

            {/* Botón */}
            <button
                onClick={handleContinue}
                className="w-full text-center p-2 bg-black text-white rounded-2xl hover:bg-gray-800 transition-colors"
                disabled={loading || !macros}
            >
                {loading ? "Guardando..." : "Continuar"}
            </button>
        </div>
    );
};

export default FinalRegisterPage;