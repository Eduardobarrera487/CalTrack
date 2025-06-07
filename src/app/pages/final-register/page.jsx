import React from 'react';
import Link from 'next/link';
import Logo from '@/app/_components/caltrackLogo';

const FinalRegisterPage = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-white min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
            {/* Flecha para regresar */}
            <Link href="/pages/user-details" className="absolute top-4 left-4">
                <img
                    src="/path/to/arrow-icon.png" // Cambia esto por la ruta correcta de tu imagen
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
                <span className="font-bold">2500 kcal!</span>
            </p>

            {/* Botón */}
            <Link
                href="/pages/dashboard" // Cambia esto por la ruta correcta de tu siguiente página
                className="w-full text-center p-2 bg-black text-white rounded-2xl hover:bg-gray-800 transition-colors"
            >
                Continuar
            </Link>
        </div>
    );
};

export default FinalRegisterPage;