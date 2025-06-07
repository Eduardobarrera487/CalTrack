import React from 'react';
import Link from 'next/link';

const UserDetailsPage = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-white min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
            {/* Flecha para regresar */}
            <Link href="/pages/new-user" className="absolute top-4 left-4">
                <img
                    src="public/left.png" // Cambia esto por la ruta correcta de tu imagen
                    alt="Regresar"
                    className="w-6 h-6"
                />
            </Link>

            <h1 className="text-2xl font-bold mb-4 text-black">Detalles del Usuario</h1>
            <form className="flex flex-col gap-6 w-full max-w-sm">
                {/* Género */}
                <div>
                    <label className="block text-black font-medium mb-2">Género</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-black">
                            <input type="radio" name="gender" value="male" />
                            Hombre
                        </label>
                        <label className="flex items-center gap-2 text-black">
                            <input type="radio" name="gender" value="female" />
                            Mujer
                        </label>
                    </div>
                </div>

                {/* Nivel de actividad */}
                <div>
                    <label className="block text-black font-medium mb-2">Nivel de actividad</label>
                    <input
                        type="text"
                        placeholder="Escoge tu nivel de actividad"
                        className="w-full border border-gray-300 rounded-lg p-2 text-gray-700"
                    />
                </div>

                {/* Preferencias Dietéticas */}
                <div>
                    <label className="block text-black font-medium mb-2">Preferencias Dietéticas</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-black">
                            <input type="checkbox" name="diet" value="vegetarian" />
                            Vegetariano
                        </label>
                        <label className="flex items-center gap-2 text-black">
                            <input type="checkbox" name="diet" value="vegan" />
                            Vegano
                        </label>
                        <label className="flex items-center gap-2 text-black">
                            <input type="checkbox" name="diet" value="pescetarian" />
                            Pescetariano
                        </label>
                    </div>
                </div>

                {/* Restricciones Dietéticas */}
                <div>
                    <label className="block text-black font-medium mb-2">Restricciones Dietéticas</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-black">
                            <input type="checkbox" name="restriction" value="gluten-free" />
                            Sin Gluten
                        </label>
                        <label className="flex items-center gap-2 text-black">
                            <input type="checkbox" name="restriction" value="lactose-free" />
                            Sin Lactosa
                        </label>
                        <label className="flex items-center gap-2 text-black">
                            <input type="checkbox" name="restriction" value="nut-free" />
                            Sin Nueces
                        </label>
                    </div>
                </div>

                {/* Botón */}
                <Link href="/pages/final-register" className="w-full text-center p-2 bg-black text-white rounded-2xl hover:bg-gray-800 transition-colors">Registrarse</Link>
            </form>
        </div>
    );
};

export default UserDetailsPage;