"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../../utils/supabase/client';

const UserDetailsPage = () => {
    const [gender, setGender] = useState('');
    const [activity, setActivity] = useState('');
    const [diets, setDiets] = useState([]);
    const [restrictions, setRestrictions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDietChange = (e) => {
        const { value, checked } = e.target;
        setDiets((prev) =>
            checked ? [...prev, value] : prev.filter((diet) => diet !== value)
        );
    };

    const handleRestrictionChange = (e) => {
        const { value, checked } = e.target;
        setRestrictions((prev) =>
            checked ? [...prev, value] : prev.filter((r) => r !== value)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setError("No autenticado");
            setLoading(false);
            return;
        }
        const { error: updateError } = await supabase
            .from("perfiles")
            .update({
                genero: gender === "male" ? "Masculino" : "Femenino",
                actividad_fisica: activity,
                preferencias: diets,
                restricciones: restrictions,
            })
            .eq("id", user.id);

        if (updateError) {
            setError(updateError.message);
            setLoading(false);
            return;
        }
        setLoading(false);
        router.push("/pages/final-register");
    };

    return (
        <div className="flex flex-col items-center justify-center bg-white min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
            {/* Flecha para regresar */}
            <Link href="/pages/new-user" className="absolute top-4 left-4">
                <img
                    src="public/left.png"
                    alt="Regresar"
                    className="w-6 h-6"
                />
            </Link>

            <h1 className="text-2xl font-bold mb-4 text-black">Detalles del Usuario</h1>
            <form className="flex flex-col gap-6 w-full max-w-sm" onSubmit={handleSubmit}>
                {/* Género */}
                <div>
                    <label className="block text-black font-medium mb-2">Género</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-black">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={gender === "male"}
                                onChange={() => setGender("male")}
                                required
                            />
                            Hombre
                        </label>
                        <label className="flex items-center gap-2 text-black">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={gender === "female"}
                                onChange={() => setGender("female")}
                                required
                            />
                            Mujer
                        </label>
                    </div>
                </div>

                {/* Nivel de actividad */}
                <div>
                    <label className="block text-black font-medium mb-2">Nivel de actividad</label>
                    <select
                        className="w-full border border-gray-300 rounded-lg p-2 text-gray-700"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        required
                    >
                        <option value="">Escoge tu nivel de actividad</option>
                        <option value="sedentario">Sedentario (poco o ningún ejercicio)</option>
                        <option value="ligero">Ligero (ejercicio ligero 1-3 días/semana)</option>
                        <option value="moderado">Moderado (ejercicio moderado 3-5 días/semana)</option>
                        <option value="intenso">Intenso (ejercicio fuerte 6-7 días/semana)</option>
                    </select>
                </div>

                {/* Preferencias Dietéticas */}
                <div>
                    <label className="block text-black font-medium mb-2">Preferencias Dietéticas</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-black">
                            <input
                                type="checkbox"
                                name="diet"
                                value="vegetarian"
                                checked={diets.includes("vegetarian")}
                                onChange={handleDietChange}
                            />
                            Vegetariano
                        </label>
                        <label className="flex items-center gap-2 text-black">
                            <input
                                type="checkbox"
                                name="diet"
                                value="vegan"
                                checked={diets.includes("vegan")}
                                onChange={handleDietChange}
                            />
                            Vegano
                        </label>
                        <label className="flex items-center gap-2 text-black">
                            <input
                                type="checkbox"
                                name="diet"
                                value="pescetarian"
                                checked={diets.includes("pescetarian")}
                                onChange={handleDietChange}
                            />
                            Pescetariano
                        </label>
                    </div>
                </div>

                {/* Restricciones Dietéticas */}
                <div>
                    <label className="block text-black font-medium mb-2">Restricciones Dietéticas</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-black">
                            <input
                                type="checkbox"
                                name="restriction"
                                value="gluten-free"
                                checked={restrictions.includes("gluten-free")}
                                onChange={handleRestrictionChange}
                            />
                            Sin Gluten
                        </label>
                        <label className="flex items-center gap-2 text-black">
                            <input
                                type="checkbox"
                                name="restriction"
                                value="lactose-free"
                                checked={restrictions.includes("lactose-free")}
                                onChange={handleRestrictionChange}
                            />
                            Sin Lactosa
                        </label>
                        <label className="flex items-center gap-2 text-black">
                            <input
                                type="checkbox"
                                name="restriction"
                                value="nut-free"
                                checked={restrictions.includes("nut-free")}
                                onChange={handleRestrictionChange}
                            />
                            Sin Nueces
                        </label>
                    </div>
                </div>

                {error && <div className="text-red-500 text-center">{error}</div>}

                {/* Botón */}
                <button
                    type="submit"
                    className="w-full text-center p-2 bg-black text-white rounded-2xl hover:bg-gray-800 transition-colors"
                    disabled={loading}
                >
                    {loading ? "Guardando..." : "Registrarse"}
                </button>
            </form>
        </div>
    );
};

export default UserDetailsPage;